var chalk = require("chalk");
var winston = require("winston");

var log = console.log;


log(chalk.keyword('orange')('Yay for orange colored text!'));
log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
log(chalk.hex('#DEADED').bold('Bold gray!'));

require("./server/index.js")();
