# Set the base image to node:21.7.2
FROM node:21.7.2

# Set environment variable for Node.js environment
ARG ENVIRONMENT
ENV NODE_ENV=$ENVIRONMENT

# Install OpenSSL
RUN apt-get update && apt-get install -y openssl

# Set the working directory inside the container
WORKDIR /usr/app

# Copy package.json and package-lock.json separately to leverage Docker caching
COPY package*.json ./

# Install project dependencies
RUN npm install --quiet --no-progress --include=dev

# Copy the rest of the application files
COPY . .

# Expose port 3000, allowing external communication with the application
EXPOSE 3000

# Copy and set entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
