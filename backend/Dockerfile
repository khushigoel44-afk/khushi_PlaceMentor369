# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage 2: Production Runtime
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

# FIX: Changed 'RUN' to 'COPY' and '--from=base' to '--from=builder'
COPY --from=builder /usr/src/app ./

USER node
EXPOSE 5000

# FIX: Standard command to run a Node.js/Express backend
CMD ["npm", "start"]