FROM ubuntu:latest

ENV PATH="/scripts:${PATH}"

RUN apt-get update && apt-get -y install cron && apt-get -y install pip && apt-get -y install libmysqlclient-dev && apt-get -y install vim

COPY ./requirements.txt /requirements.txt
RUN pip install -r /requirements.txt


RUN mkdir /app 
COPY ./ /app
WORKDIR /app

COPY ./scripts /scripts
RUN chmod +x /scripts/*

RUN mkdir -p /vol/web/static


RUN python3 manage.py crontab add
RUN service cron start

CMD ["entrypoint.sh"]
