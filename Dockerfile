FROM nginx:1.9

RUN apt-get -y update

RUN apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_5.x | bash - \
    && apt-get install -y build-essential python python-pip nodejs supervisor \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install argparse \
    && pip install xlrd

WORKDIR /opt/wolontariusze

COPY config.json.example config.json
COPY package.json .

RUN npm install

COPY . /opt/wolontariusze

ENV NODE_ENV production

RUN ./node_modules/gulp/bin/gulp.js app

COPY config/nginx.conf /etc/nginx/nginx.conf

RUN mkdir logs
COPY config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD supervisord -c /etc/supervisor/conf.d/supervisord.conf
