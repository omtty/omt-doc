import applyOmtWebpackConfig from "./util/omt-webpack-config";
import yargs from "yargs";
import path from "path";
import fs from "fs";
import * as log from "./util/log";
import runServer from "./server";

const argv = yargs
  .usage("Usage: omt-doc [options]")
  .option("cmd", {
    alias: "m",
    type: "string",
    description: "dev | build | run-server",
    default: "dev"
  })
  .help("h").argv;

if (require.main === module) {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, ".omt.doc.js");
  if (!fs.existsSync(configPath)) {
    log.error("Config file .omt.doc.js not exists!");
  }
  const config = require(configPath);
  const targetArgv = {
    cwd,
    debug: argv.cmd === "dev",
    cmd: argv.cmd || "build"
  };
  if (["server", "build", "dev"].some(item => item === argv.cmd)) {
    if (argv.cmd === "server") {
      runServer(config, targetArgv);
    } else {
      applyOmtWebpackConfig(config, targetArgv);
    }
  } else {
    log.error("Command not found(--cmd [dev|build|run-server])！");
  }
}
