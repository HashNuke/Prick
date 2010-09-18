var prick = require('prick');

// do npm install prick before using it
// or use path like require("./lib/prick")


var app = new prick();

app.forPath("/",function(req,res){
  res.writeHead(200, {"Content-Type":"text/html"})
  res.write("<b>hello world</b>");
  res.end();
});

/*
  the path is the same with or without the trailing slash
  /say is same as /say/
*/
  
app.forPath("/say",function(req,res){
  res.writeHead(200, {"Content-Type":"text/plain"})
  res.write("good morning");
  res.end();
});

// for regex, pass a regex object
app.forPath(new RegExp("/users/[a-z]*"),function(req,res,match){
  res.writeHead(200, {"Content-Type":"text/plain"})
  res.write("the path is "+match);
  res.end();
});

app.listen(8000);
