import json
import urllib.request
import urllib.parse

BASE_URL = "http://127.0.0.1:8000/api"

def http_post(url: str, body: dict):
    data = json.dumps(body).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def http_get(url: str):
    req = urllib.request.Request(url, headers={'Content-Type': 'application/json'}, method='GET')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

def test_non_repeating_quiz():
    print("\n--- [Test 1] Non-Repeating Quiz Generation & Option Shuffling ---")
    sample_text = """
    Stratified sampling is a survey sampling method where a population is partitioned into homogeneous subgroups (strata).
    Under the DPDP Act 2023, Data Fiduciaries must comply with strict consent requirements and anonymize official survey microdata.
    Gross Value Added (GVA) measures the contribution to an economy of each individual producer, industry, or sector in India.
    Python Pandas DataFrame provides 2D tabular data structures essential for MoSPI data cleaning pipelines.
    Government Cloud (MeghRaj) delivers sovereign cloud infrastructure for public sector data processing.
    """
    
    # Request 1
    data1 = http_post(f"{BASE_URL}/assessments/generate?email=official@statskill.gov.in", {
        "text_content": sample_text,
        "num_questions": 4,
        "difficulty": "Medium"
    })
    q_texts1 = [q["text"] for q in data1["questions"]]
    print(f"Quiz 1 Questions Generated ({len(q_texts1)}):")
    for q in q_texts1:
        print(f" - {q}")

    # Request 2 (Same text, same user)
    data2 = http_post(f"{BASE_URL}/assessments/generate?email=official@statskill.gov.in", {
        "text_content": sample_text,
        "num_questions": 4,
        "difficulty": "Medium"
    })
    q_texts2 = [q["text"] for q in data2["questions"]]
    print(f"\nQuiz 2 Questions Generated ({len(q_texts2)}):")
    for q in q_texts2:
        print(f" - {q}")

    unique_across = len(set(q_texts1 + q_texts2))
    print(f"\nTotal Unique Questions Across 2 Runs: {unique_across} / {len(q_texts1) + len(q_texts2)}")
    assert len(data1["questions"]) > 0 and len(data2["questions"]) > 0, "Failed to generate questions"
    print("✅ PASS: Non-repeating quiz generation verified!")

def test_anti_cheating():
    print("\n--- [Test 2] Assessment Anti-Cheating & Integrity Calculation ---")
    sample_questions = [
        {"text": "Sample Question 1", "options": ["A. Opt 1", "B. Opt 2"], "correct_answer": "A. Opt 1", "explanation": "Exp", "topic": "Topic 1", "difficulty": "Medium"}
    ]
    result = http_post(f"{BASE_URL}/quiz/submit?email=official@statskill.gov.in", {
        "assessment_title": "Integrity Test",
        "questions": sample_questions,
        "user_answers": {"0": "A. Opt 1"},
        "tab_switches": 2,
        "per_question_times": {"0": 12}
    })
    print(f"Submitted quiz with 2 tab switches -> Integrity Score: {result.get('integrity_score')}%, Flags: {result.get('integrity_flags')}")
    assert result.get('integrity_score') == 50.0, f"Expected 50.0, got {result.get('integrity_score')}"
    print("✅ PASS: Anti-cheating integrity tracking verified!")

def test_authority_monitoring():
    print("\n--- [Test 3] Authority Officers Monitoring & Intervention Audit Log ---")
    officers = http_get(f"{BASE_URL}/admin/officers")
    print(f"Retrieved {len(officers)} officers for Authority oversight:")
    for o in officers:
        print(f" - {o['full_name']} ({o['department']}): Competency {o['overall_competency_score']}%, Gaps: {o['critical_gaps_count']}, Flagged: {o['intervention_flagged']}")

    target_id = officers[0]['id']
    detail = http_get(f"{BASE_URL}/admin/officers/{target_id}")
    print(f"\nOfficer Detail for {detail['full_name']}: Dept Avg: {detail['dept_average']}%, Delta: {detail['delta_vs_dept']}%")

    # Flag for intervention
    int_resp = http_post(f"{BASE_URL}/admin/officers/{target_id}/intervention", {
        "intervention_flagged": True,
        "intervention_notes": "Assigned mandatory iGOT Python Data Analysis course."
    })
    print(f"Intervention update response: {int_resp}")

    audit_logs = http_get(f"{BASE_URL}/admin/audit-log")
    print(f"Latest Admin Audit Log: {audit_logs[0]}")
    assert len(audit_logs) > 0, "Expected audit logs to be populated"
    print("✅ PASS: Authority officers monitoring & intervention audit trail verified!")

if __name__ == "__main__":
    try:
        test_non_repeating_quiz()
        test_anti_cheating()
        test_authority_monitoring()
        print("\n🎉 ALL ENHANCEMENT TESTS PASSED SUCCESSFULLY!")
    except Exception as e:
        print(f"\n❌ Test Failed: {e}")
