from flask import Flask, request, jsonify
from symptom_extraction.extractor import extract_symptoms

app = Flask(__name__)

@app.route('/api/ai/extract', methods=['POST'])
def extract():
    text = request.json.get('text', '')
    return jsonify({"symptoms": extract_symptoms(text)})

if __name__ == '__main__':
    app.run(port=8000, debug=True)