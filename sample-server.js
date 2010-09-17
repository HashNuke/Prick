var prick = require('./prick');

var app = new prick();

app.forPath("/",function(req,res){
  res.write("hello world");
  res.end();
});

app.forPath("/say",function(req,res){
  res.write("good morning");
  res.end();
});

app.listen(8000);
