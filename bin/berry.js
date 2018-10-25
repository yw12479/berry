#!/usr/bin/env node

var path = require("path");
var program = require('commander');

try {
    var localBerry = require.resolve(path.join(process.cwd(), "node_modules", "berry", "bin", "berry.js"));
    if (__filename !== localBerry) {
        return require(localBerry);
    }
} catch (e) {}

program
  .allowUnknownOption()
  .version(require('../package.json').version)
  .usage('[options] [arguments]')
  .option('-b, --build', 'Execute webpack command to support batch operation')
  .option('-c, --copy', 'Copy all build folders to the destination directory')
  .option('-i, --init', 'Initialize using react and webpack technology stack project')
  .option('-s, --server', 'Start a server on the current command path, port=8000, host, open')
  .option('-w, --watch', 'Execute the webpack -w command only for a single project')
  .parse(process.argv);

var argv = program.args;

if (program['build']) {
    var build = require('../lib/build.js');
    build(argv);
}

if (program['copy']) {
    var copy = require('../lib/copy.js');
    copy(argv);
}

if (program['init']) {
    var init = require('../lib/init.js');
    init(argv);
}

if (program['server']) {
    var server = require('../lib/server/index.js');
    server(argv);
}

if (program['watch']) {
    var watch = require('../lib/watch.js');
    watch(argv);
}
