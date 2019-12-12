# docker build -t imqs/roads:master --build-arg NPM_PASSWORD=<developer1 password on js.imqs.co.za> .

# www dependencies
FROM node:12.13.0 as node_builder
ARG NPM_PASSWORD
RUN npm set registry http://js.imqs.co.za:4873/ && \
    TOKEN=$(curl -s -H "Accept: application/json" -H "Content-Type:application/json" -X PUT -u developer1:$NPM_PASSWORD --data "{\"name\": \"developer1\", \"password\": \"$NPM_PASSWORD\"}" http://js.imqs.co.za:4873/-/user/org.couchdb.user:developer1 2>&1 | grep -Po '(?<="token": ")[^"]*') && \
    npm set //http://js.imqs.co.za:4873/:_authToken $TOKENRUN mkdir /build
COPY package.json /build/
COPY package-lock.json /build/
WORKDIR /build/
RUN npm install

# www builder
FROM node_builder as www_builder
COPY . /build/
WORKDIR /build/
RUN rm -rf dist
RUN npm run build

######################################################################################33
FROM imqs/ubuntu-base

RUN apt-get update && apt-get install -y lighttpd

RUN rm -rf /var/www/html
COPY --from=www_builder /build/dist/ /var/www/html/roads/
RUN echo "server.error-handler-404 = \"/roads/index.html\"\n" >> /etc/lighttpd/lighttpd.conf
RUN sed -i 's/80/2048/g' /etc/lighttpd/lighttpd.conf

ENTRYPOINT ["/usr/sbin/lighttpd", "-D", "-f", "/etc/lighttpd/lighttpd.conf"]
