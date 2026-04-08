# This Dockerfile is kept for reference
# The main Dockerfile should be used from the root directory instead
# It handles multi-stage build properly

# Use the root Dockerfile if building manually:
# docker build -f Dockerfile -t sentimentwatch:latest .

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
