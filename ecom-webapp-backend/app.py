import csv
import json
import os
import pickle
import random

import google
import nltk
import numpy as np
import openai
import requests

nltk.download('punkt')
nltk.download('wordnet')
from io import StringIO

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import storage
from keras.models import load_model
from nltk.stem import WordNetLemmatizer
from textblob import TextBlob

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/get": {
                        "origins": ["http://localhost:3000", "https://gadgetco-3794d.web.app"]},
                    r"/feedback": {
                        "origins": ["http://localhost:3000", "https://gadgetco-3794d.web.app"],
                        }}) # Enable CORS and resources

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
intents_path = os.path.join(BASE_DIR, 'intents.json')
words_path = os.path.join(BASE_DIR, 'words.pkl')
classes_path = os.path.join(BASE_DIR, 'classes.pkl')
model_path = os.path.join(BASE_DIR, 'chatbot_model.h5')

lemmatizer = WordNetLemmatizer()
intents = json.loads(open(intents_path).read())
words = pickle.load(open(words_path, 'rb'))
classes = pickle.load(open(classes_path, 'rb'))
model = load_model(model_path)
ERROR_THRESHOLD = 0.75

chat_log = []

@app.route('/get', methods=['POST'])

def get_bot_response():
    message = request.json['message']
    # Gets predicted intents based on the input
    predicted_intents = predict_class(message)
    response, source = get_response(predicted_intents, intents, message)
    
    # Log conversation for further improvement and debugging
    chat_log.append({'role': 'user', 'content': message})
    chat_log.append({'role': 'system', 'content': response})
    
    return jsonify({"response": response, "source": source})

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    print("Processed words:", sentence_words)  # Debug statement
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': float(r[1])})  # Convert probability to float
    if not return_list:
        print("No intent meets the confidence threshold.")
    else:
        print("Predicted intents:", return_list) # Debug statement

    return return_list

# Update the get_response function to call GPT as a fallback if it is outside the scope of my module
def get_response(intents_list, intents_json, message):
    sentiment = get_sentiment(message)
    print("Detected sentiment:", sentiment)  # Debug statement
    # 
    if message.strip().lower() in ["hello", "hi", "hey", "wassup", "Hi there","Good morning","Howdy", "Good afternoon"]:
        response = "Hello! How can I assist you today?"
        source = 'Hardcoded'  # Indicates the response was hardcoded
        print("Response source:", source)  # Debug statement
        return response, source
    if not intents_list or intents_list[0]['probability'] < ERROR_THRESHOLD:
        print("Fallback to GPT-3, insufficient confidence.")  #indicates responce came from gpt
        response, source = get_gpt3_response(message)
    else:
        tag = intents_list[0]['intent']
        responses = [i['responses'] for i in intents_json['intents'] if i['tag'] == tag][0]
        if sentiment < -0.5:
            print("Model understands the bad Sentiment.")  # Debug statement
            response = "I'm sorry to hear that. "
            source = 'High Sentiment from AI Model'  # Indicates the response came from my model but had a bad sentiment 
        else:
            response = random.choice(responses)
            source = 'AI Model'  # Indicates the response came from my model
        print("Model understands query.")  # Debug statement
    print("Response source:", source)  # Debug statement
    return response, source

def get_gpt3_response(message, chat_log=None):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    headers = {
        'Authorization': f'Bearer {openai.api_key}',
        'Content-Type': 'application/json',
    }
    data = {
        'model': 'gpt-3.5-turbo',
        'messages': [{'role': 'system', 'content': 'You are a customer service chatbot for the website Gadgetco, which sells mobile phones and furniture.'},
                     {'role': 'user', 'content': message}]
    }
    if chat_log:
        data['messages'] = chat_log + data['messages']
    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        messages = result['choices'][0]['message']['content']
        return messages.strip(), 'ChatGPT'  # Indicates the response came from ChatGPT
    else:
        print(f"Error occurred: {response.status_code}: {response.text}")
        return "I'm having trouble connecting to the server right now.", 'Error'



def get_sentiment(text):
    testimonial = TextBlob(text)
    return testimonial.sentiment.polarity

def write_feedback_to_csv(feedback_data):
    feedback_file = os.path.join(BASE_DIR, 'feedback.csv')

    # Attempt to read existing feedback data
    try:
        with open(feedback_file, 'r', newline='') as file:
            reader = csv.DictReader(file)
            current_data = [row for row in reader]
    except FileNotFoundError:
        current_data = []

    # Write new feedback data
    fieldnames = ['message', 'response', 'sentiment', 'source']
    with open(feedback_file, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(current_data)
        writer.writerow({
            'message': feedback_data.get('message'),
            'response': feedback_data.get('response'),
            'sentiment': feedback_data.get('sentiment'),
            'source': feedback_data.get('source')
        })
    
@app.route('/feedback', methods=['POST'])
def handle_feedback():
    feedback = request.json
    feedback_data = {
        'message': feedback.get('message'),
        'response': feedback.get('response'),
        'sentiment': feedback.get('sentiment'),
        'source': feedback.get('source')
    }
    write_feedback_to_csv(feedback_data)  # Use the updated function to handle CSV
    return jsonify({"status": "Feedback sent",
                    'message': feedback.get('message'),
                    'response': feedback.get('response'),
                    'sentiment': feedback.get('sentiment'),
                    'source': feedback.get('source')
                    })

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))  
    app.run(debug=False, host='0.0.0.0', port=port)
    
    
# build and deploy server code
## gcloud builds submit --tag gcr.io/gadgetcoback/gadgetba

## gcloud run deploy --image gcr.io/gadgetcoback/gadgetba --platform managed

# server test code
# curl -X POST https://server-4tvhbvwe7q-ew.a.run.app/get -H "Content-Type: application/json" -d "{\"message\": \"hello\"}"
# curl -X POST "https://server-4tvhbvwe7q-ew.a.run.app/feedback" -H "Content-Type: application/json" -d "{\"message\": \"Hi there\", \"response\": \"Hello, how can I help?\", \"sentiment\": \"positive\", \"source\": \"AI Model\"}"



