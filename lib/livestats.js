var http        = require('http'), 
    sys         = require('sys'),
    nodeStatic  = require('node_static/lib/node-static'),
    faye        = require('faye/faye-node');
    
function LiveStats(options) {
  
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }
  
  var self = this;
  
  self.settings = {
    port: options.port,
    geoipServer: {
        hostname: options.geoipServer.hostname
      , port: options.geoipServer.port || 80
    }
  };
  
  self.init();
};

LiveStats.prototype.init = function() {
  var self = this;  
  
  self.bayeux = self.createBayeuxServer();
  
  self.httpServer = self.createHTTPServer();
  
  self.bayeux.attach(self.httpServer);
  
  self.httpServer.listen(self.settings.port);
  
  sys.log('Server started on PORT ' + self.settings.port);
};

LiveStats.prototype.createBayeuxServer = function() {
  var self = this;
  
  var bayeux = new faye.NodeAdapter({
      mount: '/faye'
    , timeout: 45
  });
  
  return bayeux;
};

LiveStats.prototype.createHTTPServer = function() {

  var self = this;  
  
  var server = http.createServer(function(request, response) {
    
    var file = new nodeStatic.Server('./public', {
      cache: false
    });
    
    request.addListener('end', function() {
      
      if (request.url == '/config.json' && request.method == "GET"){
        
        response.writeHead(200, {
          'Content-Type': 'application/x-javascript'
        });
        
        var jsonString = JSON.stringify({
          port: self.settings.port
        });
        
        response.write(jsonString);
        response.end();
        
      } else {
      
        file.serve(request, response);  
      }
    });
  });
  
  return server;
};
    
module.exports = LiveStats;
