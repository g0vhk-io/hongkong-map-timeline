#
#       -- Base Stage --
#
FROM node:10.11-alpine as base

# Install git and openssh tools
RUN apk apk update && \
        apk upgrade && \
        # install for bscrypt
        apk --no-cache add --virtual builds-deps build-base python



#
#       -- Dependencies --
#
FROM base AS dependencies

# set the tmp as workdir
WORKDIR /tmp

# Install app dependencies
COPY package.json .

# install node packages
RUN npm set progress=false \
    && npm config set depth 0 \
    && npm install --only=production

#
#     -- Release
#

FROM base AS release


RUN npm install -g pm2

# set the tmp as workdir
WORKDIR /opt/app

# copy all the production only node modules
COPY --from=dependencies /tmp/node_modules ./node_modules

# copy everythings without those indicated in .dockerignore
COPY . .

# run with pm2
CMD [ "pm2-docker", "start" , "server.config.js"]