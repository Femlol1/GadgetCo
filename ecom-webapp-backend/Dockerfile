FROM python:3.9-slim

# Allow statements and log messages to immediately appear in the native logs
ENV PYTHONUNBUFFERED True

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . ./

# Install production dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Run the web service on container startup.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app
