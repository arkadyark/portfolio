FROM node:10

MAINTAINER Nik Tsytsarkin "nik.tsytsarkin@liscena.com"

RUN apt-get update -y && apt-get install -y build-essential yarn python3

WORKDIR /app

COPY . /app

RUN yarn install

RUN yarn run build:ca

RUN yarn run build:ph

EXPOSE 8080

EXPOSE 8081

CMD python serve_ph.py& python serve_ca.py 
