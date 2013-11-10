import webapp2

import urllib

from google.appengine.api import urlfetch
import cgi

url = "http://api.opensubtitles.org/xml-rpc";
# url = "http://localhost:8080/";

class MainPage(webapp2.RequestHandler):
    def post(self):
        result = urlfetch.fetch(url, payload=self.request.body, method=urlfetch.POST, headers={'Content_Type': 'text/xml', 'Content-Type': 'text/xml'})
        self.response.headers['Content-Type'] = 'text/xml'
        self.response.write(result.content)

    def get(self):
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.write('Hello, World!')


application = webapp2.WSGIApplication([
    ('/xml-rpc', MainPage),
], debug=True)
