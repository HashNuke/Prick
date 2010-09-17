function Prick() {

  if(! (this instanceof arguments.callee))
    return new arguments.callee(arguments);

  var self = this;
  
  self.statusCode = 200
  self.requestHeaders = {}
  self.requestState = {}
  self.pathStore = []
  self.callbackStore = [];
  
  /*
    even though you've got access to request and response objects,
    it's nice to have a couple helper methods
  */
  self.setStatusCode=function(_statusCode){
    if (typeof _statusCode == "number" && parseInt(_statusCode)==_statusCode)
      self.statusCode = _statusCode;
  };
  
  self.setHeaders=function(_requestHeaders){
    if(typeof options== "object")
      self.requestHeaders = _requestHeaders;
  };
  
  self.forPath=function(_path, _callback){
    self.pathStore.push(_path);
    self.callbackStore.push(_callback);
  };


  //check if the Content-Type has been set in the header else set html as default
  self.checkContentType=function(){
    //console.log(self.requestHeaders);
    if(! self.requestHeaders['Content-Type'])
      self.requestHeaders['Content-Type']='text/html';
  };
  
  self.checkContentType();
  self.createServer();
}

Prick.prototype.createServer=function(){
  var self = this
    , http = require('http');
  
  self.server = http.createServer(function(req,res){
          
          
          res.writeHead(self.statusCode, self.requestHeaders);
          console.log(req.url);
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
                if(new RegExp(self.pathStore[i].toString()).test(_path))
                  self.callbackStore[i](req,res);
              }
            }
          };
          matchPath(req.url);
      });
  
  return self.server;
};

Prick.prototype.listen=function(_port,_ip){
  var self = this;
  self.server.listen(_port);
};

module.exports = Prick;
