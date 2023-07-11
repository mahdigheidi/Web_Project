FROM node:latest

WORKDIR /app

# COPY package.json ./

# COPY yarn.lock ./
# COPY node_modules/ ./

# RUN yarn install --frozen-lockfile --network-timeout 2000000

COPY . .

EXPOSE 3000

RUN ls
CMD ["yarn", "start"]
