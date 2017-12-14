node-packages is [require.js](http://requirejs.org/) for node.js.

### Motification

- Flattens & simplifies application structure. 
- Better encapsulation.
- More consistent.

### Example

```
- package.json - application package
- lib/ - javascript source files
  - index.js - main entry point
    - packages/ - application components
      - config/ - application config component
      - http.server/ - http server component
        - index.js   - package entry point
      - http.routes/ - http routes
        - index.js   
```

In `lib/index.js`, you'll need something like:

```javascript
var packages = require("packages");

packages.
require(__dirname + "/packages").
load();
```

In `http.server/index.js`, you might have something like:

```javascript
exports.require = ["express", "config"];
exports.load = function (express, config) {
  var app = express()
  app.listen(config.get("port"));
  return app;
};
```

In `http.routes/index.js`, you might have something like:

```javascript
exports.require = ["http.server"];
exports.load = function (app) {
  app.get("/hello", function (req, res) {
    res.send("Hello World!");
  });
};
```

### Packages API

#### packages packages()

Initializes new packages loader

#### packages.add(name, package)

Adds a package. Below's an example where this might be useful.

`lib/index.js`:

```javascript
var packages = require("packages");

module.exports = function (config) {
  packages.
  add("config", config).
  require(__dirname + "/packages").
  load();
}
```

`lib/packages/http.server/index.js`:

```javascript
exports.require = ["config"];
exports.load = function(config) {
  //init server
}
```

#### packages.require(path[, path])

loads packages from a directory

#### packages.load()

loads all the packages 

#### packages.exports

all the loaded packages

### Package API


```javascript
exports.require = [ "package.name", ["multiple.packages.*"], /package.to.match/ ];
exports.load    = function (singlePackage, multiplePackages, anotherSinglePackage, optionalSyncNext) {
  
};
```

