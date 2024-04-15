# Use an official Python runtime as a parent image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port available to the world outside this container
EXPOSE 8080

# Define environment variable to store model file path
ENV MODEL_FILE_PATH=/app/chatbot_model.h5

# Run app.py when the container launches
CMD ["python", "chatbot.py"]
