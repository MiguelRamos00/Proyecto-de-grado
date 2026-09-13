FROM node:22-alpine AS dependencias

WORKDIR /aplicacion

COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS compilacion

WORKDIR /aplicacion

ARG NEXT_PUBLIC_URL_API_BACKEND
ENV NEXT_PUBLIC_URL_API_BACKEND=$NEXT_PUBLIC_URL_API_BACKEND

COPY --from=dependencias /aplicacion/node_modules ./node_modules
COPY . .
RUN npm run compilar

FROM node:22-alpine AS produccion

WORKDIR /aplicacion

ENV NODE_ENV=production

COPY --from=compilacion /aplicacion/public ./public
COPY --from=compilacion /aplicacion/.next/standalone ./
COPY --from=compilacion /aplicacion/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
