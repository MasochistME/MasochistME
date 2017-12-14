exports.require = ["http.server"];
exports.load = function (app) {
  app.get("/hello", function(req, res) {
    res.send("hello world!");
  });
  console.log("adding routes");
}