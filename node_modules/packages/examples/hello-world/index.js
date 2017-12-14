var packages = require("../../");

packages().
require({ 
  config: {
    port: 8080
  }
}).
require(__dirname + "/packages").
load();