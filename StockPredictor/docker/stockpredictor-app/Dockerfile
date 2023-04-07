FROM ubuntu:latest

RUN apt-get update && apt-get -y install cron && apt-get -y install pip && apt-get -y install libmysqlclient-dev

RUN touch /var/log/cron.log

RUN (crontab -l ; echo "* * * * * echo "Hello World" >> /var/log/cron.log") | crontab

CMD cron && tail -f /var/log/cron.log

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1 

RUN pip install --upgrade https://storage.googleapis.com/tensorflow/mac/cpu/tensorflow-1.12.0-py3-none-any.whl
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt