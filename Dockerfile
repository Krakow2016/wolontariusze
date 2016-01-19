FROM debian:jessie

RUN apt-get -y update \
    && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_5.x | bash - \
    && apt-get install -y build-essential python nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . /opt/wolontariusze

WORKDIR /opt/wolontariusze

COPY config.json.example config.json

RUN npm install

ENV NODE_ENV production

RUN ./node_modules/gulp/bin/gulp.js app

CMD node app.js
