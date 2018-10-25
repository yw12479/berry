/**
 * @file: watch.js execute webpack watch command for every project
 * @author [yw12479]
 */
var path = require('path');
var chalk = require('chalk');
var chokidar = require('chokidar');
var childProcess = require('child_process');
var fs = require('fs-extra');

/**
 * 异步验证文件是否存在
 * @Author   yw12479
 * @DateTime 2017-03-28
 * @param    {[string]}   path [文件路径]
 * @return   {[boolean]}        [是否存在]
 */
function fsExistsSync(path) {
    try {
        fs.accessSync(path,fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * 对route目录下的文件进行监听
 * @Author   yw12479
 * @DateTime 2017-03-28
 * @param    {[string]}   route [带命令的解析路径]
 */
function fileWatch(route, callback) {
    var child = childProcess.exec(route);

    child.stdout.on('data', function (data) {
        data = data.toString();
        data = data.split('\n');

        // 对build信息处理
        data && data.map(function (item) {
            if (item.includes('ERROR') || item.includes('error')) {
                console.log(chalk.bold.red(item));
            } else if (item.includes('built')) {
                var str = item.match(/(.*)built(.*)/);
                console.log(str[1] + chalk.bold.green('built') + str[2]);
            } else if (item.includes('Child') || item.includes('hidden modules')) {
                console.log(item);
            }
            else {
                console.log(chalk.bold.green(item));
            }
        });
        callback();
    });

    child.stderr.on('data', function (data) {
        console.log(chalk.bold.red(data));
    });
}

/**
 * 监听子项目的source文件变更
 * @Author   yw12479
 * @DateTime 2017-03-28
 * @param    {[string]}   source [监听源]
 * @param    {[string]}   target [拷贝源]
 */
function listenFilesChange(source, target) {
    chokidar.watch(source, {ignored: /(^|[\/\\])\../}).on('all', (event, filePath) => {
        var _path = path.relative(source, filePath);
        try{
            fs.copySync(filePath, path.join(target, _path));
        } catch (e) {
        }
    });
}

function watch(params) {
    if (!params || params.length === 0) {
        if (!fsExistsSync(path.join(process.cwd(), 'webpack.config.js'))) {
            console.log(chalk.bold.red("can't find webpack.config.js"));
            return;
        }
        fileWatch(path.join(process.cwd(), 'node_modules', '.bin', 'webpack -w'), function () {
            listenFilesChange(path.join(process.cwd(), 'build'), path.join(process.cwd(), 'release'));
        });
    } else {
        if (!fsExistsSync(path.join(process.cwd(), params[0], 'webpack.config.js'))) {
            console.log(chalk.bold.red("can't find " + params[0] + " folder's webpack.config.js"));
            return;
        }
        var comandPath = process.cwd();

        // 改变工作目录
        process.chdir(path.resolve(process.cwd(), params[0]));
        fileWatch(path.join(process.cwd(), 'node_modules', '.bin', 'webpack -w'), function () {
            listenFilesChange(path.join(comandPath, params[0], 'build'), path.join(comandPath, 'release', params[0]));
        });
        // 恢复工作目录
        process.chdir(comandPath);
    }
}

module.exports = watch;