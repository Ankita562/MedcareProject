import medspacy
from medspacy.ner import TargetMatcher, TargetRule
import json
import sys
import re

def extract_clinical_data(text):
    # 1. Load the Med-SpaCy model
    nlp = medspacy.load()
    
    # 2. Add custom rules to catch things Tesseract might miss
    # We want to specifically look for Vitals like BP and Weight
    matcher = nlp.get_pipe("medspacy_target_matcher")
    rules = [
        TargetRule("Blood Pressure", "VITAL", pattern=[{"LOWER": "bp"}]),
        TargetRule("Weight", "VITAL", pattern=[{"LOWER": "weight"}]),
        TargetRule("Yoga", "ACTIVITY", pattern=[{"LOWER": "yoga"}]),
        TargetRule("Walk", "ACTIVITY", pattern=[{"LOWER": "walk"}])
    ]
    matcher.add(rules)

    doc = nlp(text)
    
    results = {
        "medicines": [],
        "activities": [],
        "vitals": []
    }

    # 3. Parse Entities
    for ent in doc.ents:
        label = ent.label_
        
        # Extract Medications
        if label == "MEDICATION":
            results["medicines"].append({"name": ent.text.title()})
            
        # Extract Activities/Treatments
        elif label in ["TREATMENT", "ACTIVITY", "PROCEDURE"]:
            results["activities"].append({
                "title": ent.text.title(),
                "category": "Exercise" if "walk" in ent.text.lower() or "yoga" in ent.text.lower() else "Medical"
            })

    # 4. Regex for Vitals (Pattern matching for numbers)
    # Find Blood Pressure (e.g., 120/80)
    bp_match = re.search(r'(\d{2,3}/\d{2,3})', text)
    if bp_match:
        results["vitals"].append({"label": "Blood Pressure", "value": bp_match.group(1)})

    # Find Weight (e.g., 75 kg or 75kg)
    weight_match = re.search(r'(\d{2,3})\s*(?:kg|kg\.|kilograms)', text, re.IGNORECASE)
    if weight_match:
        results["vitals"].append({"label": "Weight", "value": weight_match.group(1)})

    return json.dumps(results)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Get text from Node.js
        raw_text = sys.argv[1]
        print(extract_clinical_data(raw_text))
    else:
        print(json.dumps({"medicines":[], "activities":[], "vitals":[]}))