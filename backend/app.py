from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from urllib.parse import urlparse
import os
from database import init_db, insert_data, get_history

app = Flask(__name__)
CORS(app)

init_db()


@app.route("/")
def home():
    return "AI Phishing Detection API Running"


# ✅ HISTORY API
@app.route('/history', methods=['GET'])
def history():
    data = get_history()
    return jsonify(data)


# ✅ PREDICT API
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    url = data["url"]

    parsed = urlparse(url)
    domain = parsed.netloc

    score = 0
    reasons = []

    # 🔴 Rule 1: Invalid URL
    if not parsed.scheme or not parsed.netloc:
        result = "Phishing"
        confidence = 95
        reasons.append("Invalid URL format")

        insert_data(url, result)  # ✅ SAVE

        return jsonify({
            "result": result,
            "confidence": confidence,
            "reasons": reasons
        })

    # 🔴 Rule 2: No HTTPS
    if not url.startswith("https://"):
        score += 3
        reasons.append("No HTTPS encryption")

    # 🔴 Rule 3: Suspicious keywords
    suspicious_words = ["login", "verify", "bank", "secure", "account"]
    if any(word in url.lower() for word in suspicious_words):
        score += 3
        reasons.append("Contains suspicious keywords")

    # 🔴 Rule 4: IP address
    if re.match(r"\d+\.\d+\.\d+\.\d+", domain):
        score += 3
        reasons.append("Uses IP address instead of domain")

    # 🔴 Rule 5: Hyphen
    if "-" in domain:
        score += 2
        reasons.append("Hyphen in domain")

    # 🔴 Rule 6: Long URL
    if len(url) > 75:
        score += 2
        reasons.append("Long URL")

    # 🔴 Rule 7: Suspicious TLD
    if domain.endswith((".xyz", ".tk", ".ml", ".ga")):
        score += 3
        reasons.append("Suspicious domain extension")

    # 🔴 Rule 8: Random string domain
    if re.match(r"^[a-z0-9]{10,}$", domain.replace(".", "")):
        score += 3
        reasons.append("Random-looking domain")

    # 🎯 FINAL RESULT
    if score >= 5:
        result = "Phishing"
        confidence = min(90 + score, 99)
    else:
        result = "Legitimate"
        confidence = 70 + (5 - score) * 5

    # ✅ SAVE TO DATABASE (AFTER result defined)
    insert_data(url, result)

    return jsonify({
        "result": result,
        "confidence": confidence,
        "reasons": reasons
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)