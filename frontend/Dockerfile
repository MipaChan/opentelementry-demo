# Build stage
FROM node:20-alpine AS development

# Add build arguments
ARG NEXT_PUBLIC_API_URL
ARG OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
ARG OTEL_SERVICE_NAME

# Set as environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV OTEL_EXPORTER_OTLP_TRACES_ENDPOINT=$OTEL_EXPORTER_OTLP_TRACES_ENDPOINT
ENV OTEL_SERVICE_NAME=$OTEL_SERVICE_NAME


WORKDIR /app

# First copy package files
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm i

# Then copy the rest of the application
COPY --chown=node:node ./ ./

# Build Next.js app
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy necessary files from build stage
COPY --chown=node:node --from=development /app/public ./public
COPY --chown=node:node --from=development /app/.next/static ./.next/static
COPY --chown=node:node --from=development /app/.next/standalone ./

USER node

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production
ENV NODE_OPTIONS "--require @opentelemetry/auto-instrumentations-node/register"
CMD ["node", "server.js"]
