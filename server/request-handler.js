/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var messages = [];
var counter = 1;

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //

  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'text/plain';
  // The outgoing status.
  // var statusCode = 200;
  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  if (request.method === 'OPTIONS' && request.url.startsWith('/classes/messages')) {
    headers['Content-Type'] = 'application/json';
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end();

  } else if (request.method === 'GET' && request.url.startsWith('/classes/messages')) { // -> startsWith()
    console.log('I should GET something');
    headers['Content-Type'] = 'application/json';
    statusCode = 200;
    response.writeHead(statusCode, headers);
    let result = [];
    console.log('buffers', messages);
    //messages.forEach(buffer => result.push(JSON.parse(Buffer.concat(typeof buffer === 'string' ? buffer : [Buffer.from(buffer[0], 'UTF-8')]).toString())));
    messages.forEach(buffer => result.push(JSON.parse(buffer)));
    response.end(JSON.stringify({'results': result}));

  } else if (request.method === 'POST' && request.url.startsWith('/classes/messages')) {
    console.log('I should POST something');
    headers['Content-Type'] = 'application/json';
    let body = [];
    request.on('data', (chunk) => {
      chunk.createdAt = new Date();
      chunk.objectId = counter;
      counter++;
      console.log('chunk', chunk);
      body.push(chunk);
    });
    request.on('end', () => {
      console.log('body', body);
      console.log('body typeof', typeof body);
      body = Buffer.concat(typeof body[0] === 'string' ? [Buffer.from(body[0], 'UTF-8')] : [body[0]] ).toString();
      // at this point, `body` has the entire request body stored in it as a string
    });

    //add created at property
    // add id property equal to counter
    // counter++

    
    messages.push(body);
    statusCode = 201;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify({'results': messages}));
  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }
  // response.writeHead(statusCode, headers);
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // console.log('request', request);
  // console.log('response', response);
  // response.end('Hello, World!');
  // response.end('{"results": []}');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

exports.requestHandler = requestHandler;


