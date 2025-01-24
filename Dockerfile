# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /src

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on (e.g., 3000)
EXPOSE 3000

# Run the app (start the app on container launch)
CMD ["node", "src/app.js"]
