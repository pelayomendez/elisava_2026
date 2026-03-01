import google.generativeai as genai

GOOGLE_API_KEY ="YOUR_KEY_HERE"

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

response = model.generate_content("Write me a poem")
print(response.text)