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


# copy production node_modules aside
RUN cp -R node_modules prod_node_modules

# install ALL node_modules, including 'devDependencies'
RUN npm install

#
#     -- Build --
# 

FROM dependencies AS build
COPY . .
RUN npm run build

#
#     -- Release
#

FROM base AS release

RUN npm install -g pm2

# set the tmp as workdir
WORKDIR /opt/app

# copy all the production only node modules
COPY --from=dependencies /tmp/prod_node_modules ./node_modules

# copy all the production only node modules
COPY --from=build /tmp/built ./built

# copy everythings without those indicated in .dockerignore
COPY . .


# run with pm2
CMD [ "pm2-docker", "start" , "server.config.js"]
