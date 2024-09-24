# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install TypeScript globally
RUN npm install -g typescript

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN tsc

# Expose the application port
EXPOSE 5000

# Run the application
CMD ["node", "dist/server.js"]
