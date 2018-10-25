/**
 * @file: copy.js  copy all build into target folder
 * @author [yw12479]
 */
var path = require('path');
var chalk = require('chalk');
var fs = require('fs-extra');

function fsExistsSync(path) {
    try {
        fs.accessSync(path,fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}

function copyFile(source, target, name) {
    if (!fsExistsSync(source)) {
        console.log(chalk.bold.red(source + ' is not exists'));
        return;
    }
    try {
        fs.copy(source, target, function (err) {
            return err ? console.log(chalk.bold.red(err)) : console.log(chalk.bold.cyan(name + ' copy is success'));
        });
    } catch (e) {
    }
}

function copy(params) {
    if (!params || params.length < 2) {
        console.log(chalk.bold.red('arguments error, at least 2 Parameters'));
        return;
    }
    var target = params[params.length - 1];

    target = path.join(process.cwd(), target);
    params.splice(params.length - 1, 1);

    // copy all project's build folder into target folder
    if (params[0] === 'all') {
        fs.readdir(process.cwd(), function (err, files) {
            files && files.map(function (fileItem) {
                // 文件路径
                var fileItemPath = path.join(process.cwd(), fileItem);
                var stat = fs.lstatSync(fileItemPath);
                if (stat.isDirectory() && fileItem !== path.basename(target)) {
                    if (err) {
                        console.log(chalk.bold.red('read ' + fileItem + ' error, ' + err));
                    } else {
                        copyFile(path.join(fileItemPath, 'build'), path.join(target, fileItem), fileItem);
                    }
                }
            });
        });
    } else {
        // copy special project
        params && params.map(function (item) {
            copyFile(path.join(process.cwd(), item, 'build'), path.join(target, item), item);
        });
    }
}

module.exports = copy;