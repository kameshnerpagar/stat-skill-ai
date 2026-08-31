import os
import json
import re
import random
from typing import List, Dict, Any, Optional
from openai import OpenAI

class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def is_ai_available(self) -> bool:
        return self.client is not None

    def generate_mcqs(
        self,
        text_content: str,
        num_questions: int = 10,
        difficulty: str = "Medium",
        prior_questions: Optional[List[str]] = None,
        db: Optional[Any] = None,
        user_id: Optional[int] = None,
        material_id: Optional[int] = None
    ) -> Dict[str, Any]:
        """Generates non-repeating MCQs using LLM if available, otherwise using real sentence-extraction fallback engine."""
        prior_questions = prior_questions or []

        result = None
        if self.client:
            try:
                avoid_prompt = ""
                if prior_questions:
                    avoid_list = "\n".join([f"- {q}" for q in prior_questions[:15]])
                    avoid_prompt = f"\nCRITICAL: DO NOT repeat or generate questions similar to any of these previously generated questions:\n{avoid_list}\n"

                prompt = f"""
                You are an expert AI assessment creator for India's Official Statistical System (MoSPI).
                Analyze the following learning material text and generate {num_questions} questions of {difficulty} difficulty grounded strictly in the provided text.

                Learning Material:
                \"\"\"{text_content[:4000]}\"\"\"
                {avoid_prompt}
                Vary the question types (MCQs, True/False scenarios, and practical policy application questions).

                Return ONLY a valid JSON object matching this exact structure:
                {{
                  "topic_summary": "Short 2-sentence summary of the main topics in the material",
                  "detected_topics": ["Topic 1", "Topic 2", "Topic 3"],
                  "questions": [
                    {{
                      "text": "Grounded question text here?",
                      "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
                      "correct_answer": "B. Option 2",
                      "explanation": "Detailed explanation grounded in the text why Option 2 is correct.",
                      "topic": "Extracted Topic Name",
                      "difficulty": "{difficulty}",
                      "question_type": "MCQ"
                    }}
                  ]
                }}
                """
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": "You output strictly valid JSON."},
                        {"role": "user", "content": prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.7
                )
                result = json.loads(response.choices[0].message.content)
            except Exception as e:
                print(f"[AIService] OpenAI generation error: {e}. Switching to real text extraction fallback engine.")

        if not result:
            # Real Extraction Fallback Engine
            result = self._generate_fallback_mcqs(text_content, num_questions, difficulty, prior_questions)

        # Randomize question order and option order for every quiz render
        questions = result.get("questions", [])
        for q in questions:
            opts = q.get("options", [])
            correct = q.get("correct_answer", "")
            
            # Find raw text of correct answer before prefix
            correct_raw = re.sub(r'^[A-D]\.\s*', '', correct).strip()
            
            # Strip prefixes A., B., C., D.
            clean_opts = [re.sub(r'^[A-D]\.\s*', '', opt).strip() for opt in opts]
            
            # Shuffle options
            random.shuffle(clean_opts)
            
            # Re-assign prefixes A., B., C., D.
            new_opts = [f"{chr(65+i)}. {opt}" for i, opt in enumerate(clean_opts)]
            
            # Find new correct answer string with new prefix
            new_correct = new_opts[0]
            for opt in new_opts:
                if correct_raw and correct_raw.lower() in opt.lower():
                    new_correct = opt
                    break
            
            q["options"] = new_opts
            q["correct_answer"] = new_correct

        random.shuffle(questions)
        result["questions"] = questions[:num_questions]

        # Save to DB if session provided
        if db and result.get("questions"):
            try:
                from app.models import GeneratedQuestion, UserQuestionExposure
                for q in result["questions"]:
                    gen_q = GeneratedQuestion(
                        material_id=material_id,
                        user_id=user_id,
                        question_text=q["text"],
                        options=q["options"],
                        correct_answer=q["correct_answer"],
                        explanation=q.get("explanation", ""),
                        topic=q.get("topic", "General Statistics"),
                        difficulty=q.get("difficulty", difficulty),
                        question_type=q.get("question_type", "MCQ")
                    )
                    db.add(gen_q)
                    if user_id:
                        exp = UserQuestionExposure(
                            user_id=user_id,
                            material_id=material_id,
                            question_text=q["text"]
                        )
                        db.add(exp)
                db.commit()
            except Exception as ex:
                print(f"[AIService] Error persisting generated questions: {ex}")
                db.rollback()

        return result

    def _generate_fallback_mcqs(self, text_content: str, num_questions: int, difficulty: str, prior_questions: List[str]) -> Dict[str, Any]:
        """Real extraction-based question generator using basic NLP sentence & entity splitting."""
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text_content) if len(s.strip()) > 25]
        
        # Extract terms/words (nouns/capitalized terms)
        words = re.findall(r'\b[A-Z][a-zA-Z0-9_\-]{2,}\b', text_content)
        unique_terms = list(dict.fromkeys(words))
        
        # Distractor pool
        distractor_pool = unique_terms + ["MoSPI Guidelines", "National Indicator Framework", "Sampling Error", "Microdata Masking", "Data Fiduciary", "Stratified Strata", "Index Compilation"]
        distractor_pool = list(set(distractor_pool))

        extracted_questions = []
        prior_set = set(p.lower() for p in prior_questions)

        for sent in sentences:
            if len(extracted_questions) >= num_questions:
                break
            
            # Avoid repeating previously asked questions
            if any(p in sent.lower() for p in prior_set):
                continue

            # Look for definition/key relationship: "X is Y" or "X includes Y"
            words_in_sent = sent.split()
            if len(words_in_sent) < 6:
                continue

            # Pick a target term to turn into fill-in-the-blank or MCQ
            target_word = None
            for w in words_in_sent:
                clean_w = re.sub(r'[^\w]', '', w)
                if len(clean_w) > 4 and clean_w[0].isupper() and clean_w.lower() not in ["india", "the", "this", "these", "under", "which"]:
                    target_word = clean_w
                    break

            if not target_word:
                # Pick longest word
                clean_words = [re.sub(r'[^\w]', '', w) for w in words_in_sent if len(re.sub(r'[^\w]', '', w)) > 4]
                if clean_words:
                    target_word = max(clean_words, key=len)

            if not target_word:
                continue

            # Form fill-in-the-blank question
            q_text = sent.replace(target_word, "_______")
            if q_text in prior_set or any(q["text"] == f"Complete the statement from the text: \"{q_text}\"" for q in extracted_questions):
                continue

            # Pick 3 distractors
            other_distractors = [d for d in distractor_pool if d.lower() != target_word.lower()]
            random.shuffle(other_distractors)
            distractors = other_distractors[:3]
            while len(distractors) < 3:
                distractors.append(f"Option {len(distractors)+1}")

            options = [target_word] + distractors
            random.shuffle(options)
            formatted_opts = [f"{chr(65+i)}. {opt}" for i, opt in enumerate(options)]
            
            correct_idx = options.index(target_word)
            correct_ans = formatted_opts[correct_idx]

            extracted_questions.append({
                "text": f"Complete the statement from the uploaded material: \"{q_text}\"",
                "options": formatted_opts,
                "correct_answer": correct_ans,
                "explanation": f"The exact sentence from the source text is: '{sent}'",
                "topic": "Document Content Extraction",
                "difficulty": difficulty,
                "question_type": "Fill-in-the-blank"
            })

        # Base statistical domain bank as supplement if document text is small
        question_bank = [
            {
                "text": "Which sampling technique divides the population into non-overlapping groups (strata) and draws independent samples from each?",
                "options": ["A. Simple Random Sampling", "B. Stratified Sampling", "C. Cluster Sampling", "D. Systematic Sampling"],
                "correct_answer": "B. Stratified Sampling",
                "explanation": "Stratified sampling ensures representation across homogeneous subgroups (strata) by sampling from each group independently.",
                "topic": "Survey Sampling Methods",
                "difficulty": difficulty,
                "question_type": "MCQ"
            },
            {
                "text": "What is the primary indicator used by MoSPI to measure wholesale price changes in India?",
                "options": ["A. Consumer Price Index (CPI)", "B. Wholesale Price Index (WPI)", "C. Index of Industrial Production (IIP)", "D. Gross Value Added (GVA)"],
                "correct_answer": "B. Wholesale Price Index (WPI)",
                "explanation": "WPI tracks price movements at the wholesale level before reaching retail markets.",
                "topic": "Price Statistics",
                "difficulty": difficulty,
                "question_type": "MCQ"
            },
            {
                "text": "In Python pandas library, which data structure represents a 2-dimensional labeled tabular data structure?",
                "options": ["A. Series", "B. DataFrame", "C. Panel", "D. NDArray"],
                "correct_answer": "B. DataFrame",
                "explanation": "A DataFrame is pandas' primary 2D tabular data structure with heterogeneous column types.",
                "topic": "Python for Data Analysis",
                "difficulty": difficulty,
                "question_type": "MCQ"
            },
            {
                "text": "Under India's Digital Personal Data Protection (DPDP) Act 2023, what is the role responsible for determining the purpose of data processing?",
                "options": ["A. Data Principal", "B. Data Fiduciary", "C. Data Processor", "D. Consent Manager"],
                "correct_answer": "B. Data Fiduciary",
                "explanation": "A Data Fiduciary determines the purpose and means of processing personal data.",
                "topic": "Data Privacy & Governance",
                "difficulty": difficulty,
                "question_type": "MCQ"
            },
            {
                "text": "Which cloud computing deployment model is shared exclusively by multiple organizations with common compliance or security concerns?",
                "options": ["A. Public Cloud", "B. Private Cloud", "C. Community / Government Cloud", "D. Hybrid Cloud"],
                "correct_answer": "C. Community / Government Cloud",
                "explanation": "Government Cloud infrastructure is tailored to public sector compliance, sovereign security, and intra-agency interoperability.",
                "topic": "Cloud Computing",
                "difficulty": difficulty,
                "question_type": "MCQ"
            },
            {
                "text": "What is the main goal of data normalisation in statistical database management?",
                "options": ["A. Increasing file compression ratio", "B. Reducing data redundancy and improving integrity", "C. Converting data into machine learning arrays", "D. Encrypting sensitive survey records"],
                "correct_answer": "B. Reducing data redundancy and improving integrity",
                "explanation": "Normalization organizes fields and tables of a relational database to minimize redundancy and dependency.",
                "topic": "SQL & Data Engineering",
                "difficulty": difficulty,
                "question_type": "MCQ"
            },
            {
                "text": "Scenario: An officer needs to predict continuous crop yield outputs from historical weather data. Which algorithm is best suited?",
                "options": ["A. Logistic Regression", "B. Linear Regression", "C. K-Means Clustering", "D. Naive Bayes"],
                "correct_answer": "B. Linear Regression",
                "explanation": "Linear regression models continuous target variables such as crop yields or GDP growth.",
                "topic": "AI & ML Applications",
                "difficulty": difficulty,
                "question_type": "Scenario"
            }
        ]

        # Filter out prior asked bank questions
        bank_filtered = [q for q in question_bank if q["text"].lower() not in prior_set]

        all_questions = extracted_questions + bank_filtered
        random.shuffle(all_questions)
        selected_questions = all_questions[:num_questions]

        detected_topics = ["Source Document Extraction", "Statistical Methodology", "Data Governance"]
        if unique_terms:
            detected_topics.extend(unique_terms[:3])

        return {
            "topic_summary": f"Analyzed uploaded material ({len(text_content)} characters) and generated real extraction-based non-repeating questions grounded in source sentences and key technical entities.",
            "detected_topics": list(set(detected_topics)),
            "questions": selected_questions
        }

    def generate_quiz_feedback(self, score: int, max_score: int, topic_breakdown: Dict[str, float]) -> str:
        """Generates AI learning feedback based on quiz performance."""
        pct = (score / max_score) * 100 if max_score > 0 else 0
        weak_topics = [t for t, s in topic_breakdown.items() if s < 70]
        strong_topics = [t for t, s in topic_breakdown.items() if s >= 70]

        if self.client:
            try:
                prompt = f"""
                An official scored {score}/{max_score} ({pct:.1f}%) on a competency assessment.
                Strong topics: {', '.join(strong_topics) if strong_topics else 'None'}
                Weak topics needing improvement: {', '.join(weak_topics) if weak_topics else 'None'}

                Write a 3-sentence encouraging and constructive AI feedback for the official. Mention specific recommended focus areas.
                """
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.5
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                print(f"[AIService] OpenAI feedback error: {e}")

        # Deterministic feedback fallback
        if pct >= 80:
            msg = f"Excellent performance ({pct:.0f}% score)! You demonstrated strong mastery in {', '.join(strong_topics) if strong_topics else 'core statistical concepts'}. "
            if weak_topics:
                msg += f"To achieve total proficiency, review {', '.join(weak_topics)} before taking advanced modules."
            else:
                msg += "You are ready to advance to higher-level technical competency paths."
            return msg
        else:
            msg = f"Good effort! You scored {pct:.0f}%. You performed best in {', '.join(strong_topics) if strong_topics else 'foundational topics'}. "
            if weak_topics:
                msg += f"Your primary development focus areas are {', '.join(weak_topics)}. We recommend enrolling in targeted iGOT Karmayogi modules to close these specific gaps."
            return msg

    def answer_statbot_question(self, user_message: str, user_context: Optional[Dict[str, Any]] = None) -> str:
        """StatBot AI learning assistant response generator."""
        if self.client:
            try:
                system_prompt = "You are StatBot, an AI learning assistant for officials in India's Official Statistical System (MoSPI). Be helpful, authoritative, precise, and practical."
                if user_context:
                    system_prompt += f" Learner Profile: Designation: {user_context.get('designation')}, Competency Score: {user_context.get('competency_score')}%, Career Goal: {user_context.get('career_goal')}."

                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message}
                    ],
                    temperature=0.4
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                print(f"[AIService] StatBot OpenAI error: {e}")

        # Fallback responses tailored to query keywords
        msg = user_message.lower()
        if "stratified" in msg or "sampling" in msg:
            return "Stratified sampling involves dividing a population into homogeneous subgroups called 'strata' (e.g. by state, district, or income level) and selecting a random sample from each stratum. This ensures higher precision and smaller standard errors compared to Simple Random Sampling, especially when sample sizes across subgroups must be guaranteed."
        elif "python" in msg:
            return "Python is essential in modern statistical processing at MoSPI. Key libraries include `pandas` for data manipulation, `numpy` for numerical array computing, `statsmodels` for econometric analysis, and `matplotlib`/`seaborn` for data visualization. To get started, take the iGOT course 'Python for Data Analysis in Official Statistics'."
        elif "data privacy" in msg or "dpdp" in msg or "privacy" in msg:
            return "Data privacy in official statistics ensures that survey responses and microdata cannot be linked back to individual citizens or establishments. Under the DPDP Act 2023 and MoSPI Metadata Standards, official data pipelines apply anonymization, k-anonymity masking, and strict Data Fiduciary protocols."
        elif "cloud" in msg:
            return "Government Cloud (MeghRaj) provides scalable computing infrastructure for high-volume survey data pipelines, central national databases, and automated reporting. Learning cloud computing enables officials to build automated ETL pipelines and host interactive statistical web dashboards."
        elif "course" in msg or "recommend" in msg or "learn next" in msg:
            return "Based on your competency profile, your highest priority skill gap is in Cloud Computing and Python Data Engineering. I recommend starting with 'Python for Data Analysis' (iGOT) followed by 'Cloud Computing Fundamentals for Government Officials'."
        else:
            return f"Thank you for your question regarding '{user_message}'. In India's Official Statistical System, continuously integrating modern technology—such as automated data validation, GIS spatial mapping, and Python analytics—drives data quality and timely policy formulation. How can I help you explore specific iGOT courses or statistical methodologies today?"
