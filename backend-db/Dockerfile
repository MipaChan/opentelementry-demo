# Build stage
FROM node:20-alpine AS development

WORKDIR /app

# First copy package files
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci

# Then copy the rest of the application
COPY --chown=node:node ./ ./

# Build and prune dev dependencies
RUN npm run build \
    && npm prune --omit=dev

# Production stage
FROM node:20-alpine AS production

WORKDIR /var/www/app

# Create the necessary directories with correct permissions
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node --from=development /app/dist ./dist
COPY --chown=node:node --from=development /app/package*.json ./

USER node

EXPOSE 3002

CMD ["node", "dist/main"]
