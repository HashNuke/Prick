Prick.js
=========

### A simple web framework for Node.js

There's example.js for you to checkout and the there code is documented.

*   import prick

        `var prick = require('prick');`

*   create a new prick

        `var app = new prick(); // skipping the new keyword is ok too`

*   Start pricking urls

        `app.forPath("/xyz", function(request, response){
            response.writeHead(200, {"Content-Type":"text/html"})
            response.write("<h1>hello world</h1>");
            response.end();
        });`

*   Incase of a regex url pass a regex object and a match is passed to your callback

        `app.forPath("/xyz", function(request, response, match){
            response.writeHead(200, {"Content-Type":"text/html"})
            response.write("the match is "+ match);
            response.end();
        });`


404s are handled based on unfinished responses, so if you leave a request unended... i'll threaten you with a 404 :)

Right now there's no default headers. So this damn thing sounds lengthy. I'll fix this soon.

## TODO

* helpers to set headers and status code
* Static file handlers
* WebSocket support (via Faye)
* Session and cookie support
* Dependency management

Until then take a look at example.js for some goodness :)

### Happy message

I'm happy coz I can say...
> "dude, I wrote a web framework".

Ok seriously, I wrote this because I wanted to learn how frameworks worked and I needed a nice little framework to handle static files too (easily). Haven't reached that milestone, but soon will.
