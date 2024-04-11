import pickle

import nltk
import numpy as np
from flask import Flask, jsonify, request
from keras.models import load_model
from nltk.stem import WordNetLemmatizer

app = Flask(__name__)

# Load the trained model and other necessary assets
model = load_model('chatbot_model.h5')
lemmatizer = WordNetLemmatizer()

# Load your words and classes
with open('words.pkl', 'rb') as file:
    words = pickle.load(file)

with open('classes.pkl', 'rb') as file:
    classes = pickle.load(file)

# Function to preprocess user messages
def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words if word not in ['?', '!', '.', ',']]
    return sentence_words

# Convert the user's message into a bag of words
def bow(sentence, words, show_details=True):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)  
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s: 
                bag[i] = 1

    return(np.array(bag))

# Endpoint to get responses from the model
@app.route('/get', methods=['POST'])
def get_bot_response():
    userText = request.form['msg']
    p = bow(userText, words, show_details=False)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]

    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({"intent": classes[r[0]], "probability": str(r[1])})

    # You can expand this section to return a more meaningful response based on the intent
    response = "I didn't understand that. Can you rephrase it?"
    if return_list:
        response = f"I think you are talking about {return_list[0]['intent']} with a confidence of {return_list[0]['probability']}"

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(port=5000)  # Or any port you prefer