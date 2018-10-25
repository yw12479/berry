/**
 * @file: build.js execute webpack command for every project
 * @author [yw12479]
 */
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var childProcess = require('child_process');

/**
 * 验证文件是否存在
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
 * 对route目录下的文件进行执行命令
 * @Author   yw12479
 * @DateTime 2017-03-28
 * @param    {[string]}   route [带命令的路径]
 */
function fileBuild(route, name) {
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
        console.log(chalk.bold.cyan(name + ' build success'));
    });

    child.stderr.on('data', function (data) {
        console.log(chalk.bold.red(data));
        console.log(chalk.bold.red(name + ' build error'));
    });
}

/**
 * 当前目录下打包，包含单个和全部
 * @Author   yw12479
 * @DateTime 2017-03-30
 */
function webpack () {
    var comandPath = process.cwd();

    if (fsExistsSync(path.join(process.cwd(), 'webpack.config.js'))) {
        fileBuild(path.join(process.cwd(), 'node_modules', '.bin', 'webpack'), path.basename(process.cwd()));
    }

    fs.readdir(process.cwd(), function (err, files) {
        if (err) {
            console.log(chalk.bold.red('read ' + files + ' error, ' + err));
        } else {
            files && files.map(function (projectItem) {
                var stat = fs.lstatSync(path.join(process.cwd(), projectItem));
                if (!stat.isDirectory() || !fsExistsSync(path.join(process.cwd(), projectItem, 'webpack.config.js'))) {
                    return;
                }
                // 改变工作目录
                process.chdir(path.join(comandPath, projectItem));
                fileBuild(path.join(process.cwd(), 'node_modules', '.bin', 'webpack'), projectItem);
                // 恢复
                process.chdir(comandPath);
            })
        }
    });
}

/**
 * 批量打包
 * @Author   yw12479
 * @DateTime 2017-03-30
 * @param    {[Array]}   params [命令参数]
 */
function batchWebpack (params) {
    var comandPath = process.cwd();

    params && params.map(function (item) {
        fs.readdir(path.join(process.cwd(), item), function (err, files) {
            files && files.map(function (fileItem) {
                if (fileItem !== 'webpack.config.js') {
                    return;
                }
                // 改变工作目录
                process.chdir(path.join(comandPath, item));
                fileBuild(path.join(process.cwd(), 'node_modules', '.bin', 'webpack'), item);
                // 恢复
                process.chdir(comandPath);
            });
        });
    });
}

/**
 * 对项目的进行打包，提供批量的打包的方式
 * @Author   yw12479
 * @DateTime 2017-03-28
 * @param    {[Array]}   params [批量打包项目名称，按空格隔开]
 */
function build (params) {
    var comandPath = process.cwd();
    // 单个打包
    if (!params || params.length === 0) {
        webpack(params);
    } else {
        batchWebpack(params);
    }
}

module.exports = build;