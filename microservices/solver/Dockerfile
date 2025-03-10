FROM python:3.8-slim AS python-tools

RUN pip3 install ortools

FROM node:latest

COPY . /src
COPY --from=python-tools /usr/local /usr/local

WORKDIR /src

RUN npm install --production

ENV PYTHON_BIN_PATH=/usr/local/bin/python

EXPOSE 5000

CMD npm run dev