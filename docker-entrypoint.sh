#!/bin/bash

# Function for handling errors
handle_error() {
    echo "Error: $1" >&2
    exit 1
}

echo "Installing dependencies"
npm install || handle_error "Failed to install dependencies"

if [ -z "$NODE_ENV" ]; then
  handle_error "NODE_ENV is not set"

elif [ "$NODE_ENV" = "development" ]; then
  echo "Running API in development mode"
  npm run dev || handle_error "Failed to start API in development mode"

elif [ "$NODE_ENV" = "production" ]; then
  echo "Running API in production mode"
  npm run start || handle_error "Failed to build API for production"

else
  handle_error "Invalid value for NODE_ENV: $NODE_ENV"

fi
