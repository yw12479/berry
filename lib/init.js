/**
 * @file: init.js  intinital project with react and webpack technology stack
 * @author [yw12479]
 */
var path = require('path');
var chalk = require('chalk');
var fs = require('fs-extra');

function Init(params) {
    var soruce = path.join(path.resolve(__dirname, '..', 'structure', 'init'));

    if (params && params.length > 0) {
        params && params.map(function (item) {
            var target = path.join(process.cwd(), item);
            fs.copy(soruce, target, function (err) {
                return err ? console.log(chalk.bold.red(err)) : console.log(chalk.bold.green(path.basename(target) + ' project intinital success'));
            });
        });
    } else {
        fs.copy(soruce, '', function (err) {
            return err ? console.log(chalk.bold.red(err)) : console.log(chalk.bold.green('project Intinital success'));
        });
    }
}

module.exports = Init;