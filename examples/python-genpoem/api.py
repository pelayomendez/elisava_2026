from flask import Flask, jsonify
import google.generativeai as genai

GOOGLE_API_KEY ="YOUR_KEY_HERE"

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

app = Flask(__name__)

@app.route('/generate-poem', methods=['GET'])
def generate_poem():
    response = model.generate_content("Write me a poem")
    return jsonify({"poem": response.text})

@app.route('/generate-recipe', methods=['GET'])
def generate_recipe():
    response = model.generate_content("Write me a recipe")
    return jsonify({"poem": response.text})

if __name__ == '__main__':
    app.run(debug=True)