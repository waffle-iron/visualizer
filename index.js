var chalk = require("chalk");
var winston = require("winston");

winston.info(chalk.yellow(charLen("\u258A","Starting Visualizer...".length)));
winston.info(chalk.red.bold("Starting Visualizer..."));
winston.info(chalk.yellow(charLen("\u258A","Starting Visualizer...".length)));

function charLen(c,len) {
  out = "";
  for (var i = 0; i < len; i++) {
    out += c;
  }
  return out;
}

require("./server/index.js")();
