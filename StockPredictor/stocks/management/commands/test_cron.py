from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

import logging

logger = logging.getLogger('django')



class Command(BaseCommand):
   

    def handle(self, *args, **options):


        print('testing!!!!!!!!!!!!', flush=True)
        logger.info("testing logger")