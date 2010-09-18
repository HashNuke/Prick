function Prick() {
  
  // return an object of self if called like a function
  if(! (this instanceof arguments.callee))
    return new arguments.callee(arguments);

  var self = this;
  
  // status code default is 200
  self.statusCode = 200;
  
  // headers
  self.requestHeaders = {};

  // to store string and regex paths
  self.pathStore = [];
  
  // to store callbacks
  self.callbackStore = [];
  
  /*
    even though you've got access to request and response objects,
    it's nice to have a couple helper methods
  */
  self.setStatusCode = function(_statusCode){
    if (typeof _statusCode == "number" && parseInt(_statusCode)==_statusCode)
      self.statusCode = _statusCode;
  };
  
  self.setHeaders = function(_requestHeaders){
    if(typeof options== "object")
      self.requestHeaders = _requestHeaders;
  };

  // allows user to add request handlers  
  self.forPath = function(_path, _callback){
    if(typeof _path == "string")
    {
      _path = _path.trim();
      if (_path[_path.length-1]=="/")
      {
        _path = _path.substr(0, _path.length-1);
      }
    }
    self.pathStore.push(_path);
    self.callbackStore.push(_callback);
  };


  //check if the Content-Type has been set in the header else set html as default
  self.checkContentType = function(){
    //console.log(self.requestHeaders);
    if(! self.requestHeaders['Content-Type'])
      self.requestHeaders['Content-Type']='text/html';
  };
  
  self.checkContentType();
  self.createServer();
}

Prick.prototype.createServer = function(){
  var self = this
    , http = require('http');

  self.server = http.createServer(function(req,res){
          
          res.writeHead(self.statusCode, self.requestHeaders);

          function matchPath(_path)
          {
            //can't use indexOf to point to position of object in array. So have to loop.  
            for(i in self.pathStore)
            {
              if(typeof self.pathStore[i]=="string")
              {
                //if exact path string
                if(self.pathStore[i] ==_path)
                {
                  self.callbackStore[i](req,res);
                }
              }
              else
              {
                //must be a regex object
                var match = self.pathStore[i].exec(_path);
                if( match != null && match[0] == _path)
                  self.callbackStore[i](req,res,match);
              }
            }
            
            // if a match isnt found spit out a 404 and end it.
            if(res.finished==false)
            {
              res.writeHead(404, self.requestHeaders);
              res.end();
            }
          };
          
          // to parse url and clean it
          function cleanUrl(url){
            var urlParse = require('url').parse;

            url = urlParse(url).pathname;
            if(url[url.length - 1] == "/")
            {
              url = url.substr(0, url.length-1);
            }
            return url;
          };
          
          // clean the url and match it
          matchPath(cleanUrl(req.url));
      });
  
  return self.server;
};

// listen function. take the server object and call listen on it :)
Prick.prototype.listen = function(_port,_ip){
  var self = this;
  self.server.listen(_port);
};

// export as a node module
module.exports = Prick;
