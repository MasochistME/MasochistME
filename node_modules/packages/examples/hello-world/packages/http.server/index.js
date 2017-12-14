exports.require = ["express", "config"];
exports.load = function (express, config) {
  var app = express();
  console.log(routes);
  app.listen(config.port);
  console.log("listening on port %d", config.port);
  return app;
}