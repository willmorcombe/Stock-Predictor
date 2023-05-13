FROM ubuntu:latest

ENV PATH="/scripts:${PATH}"

RUN apt-get update && apt-get -y install cron && apt-get -y install pip && apt-get -y install libmysqlclient-dev

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt



RUN mkdir /app 
COPY ./ /app
WORKDIR /app

COPY ./scripts /scripts
RUN chmod +x /scripts/*

RUN mkdir -p /vol/web/static

RUN service cron start
RUN python3 manage.py crontab add

CMD ["entrypoint.sh"]
