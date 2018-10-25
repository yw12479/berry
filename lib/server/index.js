/**
 * @file: server/index.js
 * @author [yw12479]
 */

var os = require('os');
var fs = require('fs');
var path = require('path');
var http = require('http');
var https = require('https');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

// nodejs web 中间件
var connect = require('connect');
// express serve-static
var serveStatic = require('serve-static');
// // express serve-index
var serveIndex = require('serve-index');
// var fallback = require('connect-history-api-fallback');

var app = connect();
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

function init(param) {
    app.use(serveStatic(process.cwd(), { 'index': [] }));
    app.use(serveIndex(process.cwd(), { 'icons': true }));
}

// 参数格式化处理
function formatArguments(param) {
    var argv = {};
    param && param.map(function (item) {
        var tmp = item.split('=');
        if (tmp && tmp.length === 2) {
            argv[tmp[0]] = tmp[1];
        } else {
            argv[item] = true;
        }
    })
    return argv;
}

function openURL (url) {
    switch(process.platform) {
        case 'darwin':
            exec('open ' + url);
            break;
        case "win32":
          exec('start ' + url);
          break;
        default:
          spawn('xdg-open', [url]);
          break;
    }
}

function getIPAddress () {
    var ip = '';
    var ifaces = os.networkInterfaces();
    for (var i in ifaces) {
        ifaces[i].forEach(function (item) {
            if (ip === '' && item.family === 'IPv4' && !item.internal) {
                ip = item.address;
                return;
            }
        });
    }
    return ip || "127.0.0.1";
}

function createHttp(param) {
    var port = parseInt(param.port, 10) || 8000;
    var hostname = param.host || getIPAddress();
    http.createServer(app).listen(port, function () {
        port = (port != 80 ? ':' + port : '');
        var url = "http://" + hostname + port + '/';
        console.log('http server at ' + url);
        if (param.open) {
            openURL(url);
        }
    });
}

function createHttps(param) {
    var port = parseInt(param.port, 10) ? parseInt(param.port, 10) + 1 : 8001;
    var hostname = param.host || getIPAddress();
    var options = {
        key: fs.readFileSync(path.join(__dirname, 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
    };
    https.createServer(options, app).listen(port, function () {
        port = (port != 80 ? ':' + port : '');
        var url = "https://" + hostname + port + '/';
        console.log('https server at ' + url);
    });
}

function server(param) {
    param = formatArguments(param);
    init(param);
    createHttp(param);
    createHttps(param);
}

module.exports = server;