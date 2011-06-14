require.paths.unshift(__dirname + "/vendor");

process.addListener('uncaughtException', function(error, stack) {
  console.log('-------------');
  console.log('Exception: ' + error);
  console.log(error.stack);
  console.log('-------------');
});

var LiveStats = require('./lib/livestats');

new LiveStats({
  port: 8000,
  geoipServer: {
      hostname: 'geoip.peepcode.com'
    , port: 80
  }
});

