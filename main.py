#!/usr/bin/env python

#  Routes
#  /
#  

#  Decorators
#  @login_required

import os

# They are changing Django version, need to include this
# http://code.google.com/appengine/docs/python/tools/libraries.html#Django
from google.appengine.ext.webapp import template

import wsgiref.handlers, logging
import cgi, time, datetime
from google.appengine.ext.webapp import template
from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
#  from google.appengine.ext.webapp.util import login_required
#  from google.appengine.api import users
#  from google.appengine.api import mail
#  from google.appengine.api import memcache
#  from google.appengine.api import taskqueue

from django.utils import simplejson

from usermodels import *  #I'm storing my models in usermodels.py


class MainHandler(webapp.RequestHandler):
  def get(self, resource=''):
    render_template(self, 'templates/index.html')

class JSONPicturesHandler(webapp.RequestHandler):
  def get(self):
    p = Picture.gql("order by when_created desc limit 10")
    
    pictures = []    
    for i in p:
      tags = []

      tmp = {
        'id': i.key().id(),
        'name': i.name,
        'path': i.path,
        'tags': [i for i in i.tags.split(',') if i != '']
      }
      pictures.append(tmp)
      
      
    output = {
      'pictures': pictures
    }
    render_json(self, output)
    
  def post(self, resource=''):
    data = simplejson.loads(self.request.body)
    
    p = Picture()
    p.name = data['name']
    p.path = data['path']
    p.tags = ','.join(data['tags'])    
    p.save()
    
    self.response.set_status(201)

class JSONPicturesByIDHandler(webapp.RequestHandler):
  def get(self, resource=''):
    if resource == '':
      self.error(404)
    
    try:  
      p = Picture.get_by_id(int(resource))
      key = p.key()
    except:
      self.error(404)
      return
      
    pictures = []
    tmp = {
      'id': key.id(),
      'name': p.name,
      'path': p.path,
      'tags': p.tags.split(',')
    }
    pictures.append(tmp)
      
    output = {
      'pictures': pictures
    }
    render_json(self, output)
    
  def put(self, resource=''):
    if resource == '':
      self.error(404)
    
    data = simplejson.loads(self.request.body)
    
    p = Picture.get_by_id(int(resource))
    p.name = data['name']
    p.path = data['path']
    p.tags = ','.join(data['tags'])
    p.save()
    
  
  



def is_local():
  # Turns on debugging error messages if on local env  
  return os.environ["SERVER_NAME"] in ("localhost")  
    
def render_template(call_from, template_name, template_values=dict()):
  # Makes rendering templates easier.
  path = os.path.join(os.path.dirname(__file__), template_name)
  call_from.response.out.write(template.render(path, template_values))

def render_json(self, data):
  self.response.headers['Content-Type'] = 'application/json'
  self.response.out.write(simplejson.dumps(data))
  


app = webapp.WSGIApplication([('/', MainHandler),
                              ('/tag/([^/]+)?', MainHandler), #backbone.js route
                              ('/pictures', JSONPicturesHandler),
                              ('/pictures/([^/]+)?', JSONPicturesByIDHandler)],
                              debug = is_local())
                                         
