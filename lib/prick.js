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


  // TODO: set default content-type
  // TODO: helper to set headers (was here i killed it)

  self.createServer();
}

Prick.prototype.createServer = function(){
  var self = this
    , connect = require('connect');

  self.server = connect.createServer(function(req,res){
          
          function matchPath(_path)
          {
            //can't use indexOf to point to position of regex object in array. So have to loop.  
            for(i in self.pathStore)
            {
              if(typeof self.pathStore[i]=="string")
              {
                //if exact path string, then cool guy is who he says he is
                if(self.pathStore[i] ==_path)
                  self.callbackStore[i](req,res);
              }
              else
              {
                //must be a regex object.  A crazy spy
                var match = self.pathStore[i].exec(_path);
                if( match != null && match[0] == _path)
                  self.callbackStore[i](req,res,match);
              }
            }
            
            // if a match isn't found curse with 404
            if(res.finished==false)
            {
              res.writeHead(404, self.requestHeaders);
              res.end();
            }
          };
          
          // to parse url and exorcise it of the evil trailing slash
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

// listen function. take the server object and call listen on it
Prick.prototype.listen = function(_port,_ip){
  var self = this;
  self.server.listen(_port);
};

// export as a node module for good karma :)
module.exports = Prick;
