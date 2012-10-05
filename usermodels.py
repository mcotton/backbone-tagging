from google.appengine.ext import db

class Picture(db.Model):
  name = db.StringProperty()
  when_created = db.DateTimeProperty(auto_now_add=True)
  last_modified = db.DateTimeProperty(auto_now=True)
  path = db.StringProperty()
  tags = db.StringProperty(default='')
  img = db.BlobProperty()
  