FROM python:3.8

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY requirements.txt ./
RUN pip3 install -r requirements.txt

# Copy app source code
COPY . .

# Expose port
EXPOSE $PORT

CMD uvicorn main:app --host 0.0.0.0 --port $PORT