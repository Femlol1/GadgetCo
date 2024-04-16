import json
import os
import pickle
import random

import nltk
import numpy as np
import openai
import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from keras.models import load_model
from nltk.stem import WordNetLemmatizer
from textblob import TextBlob

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS

lemmatizer = WordNetLemmatizer()
intents = json.loads(open('./intents.json').read())
words = pickle.load(open('words.pkl', 'rb'))
classes = pickle.load(open('classes.pkl', 'rb'))
model = load_model('./chatbot_model.h5')
chat_log = []

@app.route('/get', methods=['POST'])

def get_bot_response():
    message = request.json['message']
    # Get predicted intents based on the input
    predicted_intents = predict_class(message)
    response = get_response(predicted_intents, intents, message)

    # Log conversation for further improvement and debugging
    chat_log.append({'role': 'user', 'content': message})
    chat_log.append({'role': 'GadgetCo customer service assistant', 'content': response})
    
    return jsonify({"response": response})

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
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
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({'intent': classes[r[0]], 'probability': float(r[1])})  # Convert probability to float
    return return_list

# Update the get_response function to call GPT as a fallback if it is outside the scope of my module
def get_response(intents_list, intents_json, message):
    sentiment = get_sentiment(message)
    if not intents_list or intents_list[0]['probability'] < 0.25:
        response = get_gpt3_response(message)
    else:
        tag = intents_list[0]['intent']
        responses = [i['responses'] for i in intents_json['intents'] if i['tag'] == tag][0]
        if sentiment < -0.5:  # Highly negative sentiment
            response = "I'm sorry to hear that. " + random.choice(responses)
        else:
            response = random.choice(responses)
    return response
        
        
def get_gpt3_response(message, chat_log=None):
    openai.api_key = os.getenv("OPENAI_API_KEY")

    headers = {
        'Authorization': f'Bearer {openai.api_key}',
        'Content-Type': 'application/json',
    }

    data = {
        'model': 'gpt-3.5-turbo',  # Specify the model you're using
        'messages': [
            {'role': 'system', 'content': 'You are a helpful assistant.'},
            {'role': 'user', 'content': message},
        ]
    }

    if chat_log:
        data['messages'] = chat_log + data['messages']

    response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=data)

    if response.status_code == 200:
        result = response.json()
        messages = result['choices'][0]['message']['content']
        return messages.strip()
    else:
        print(f"Error occurred: {response.status_code}: {response.text}")
        # Return an empty string or a default message if the API call failed
        return "I'm having trouble connecting to the server right now. (Error {response.status_code})"

def get_sentiment(text):
    testimonial = TextBlob(text)
    return testimonial.sentiment.polarity 

if __name__ == '__main__':
    app.run(port=5000)

# neede to test the back end server
# curl -X POST http://localhost:5000/get -H "Content-Type: application/json" -d "{\"message\": \"hello\"}"

# if __name__ == "__main__":
#     port = int(os.environ.get('PORT', 8080))  
#     app.run(debug=False, host='0.0.0.0', port=port)