FROM node

COPY . /src

RUN cd /src; npm install --save;

CMD ["node", "/src/bin/www"]