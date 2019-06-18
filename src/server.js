import express from "express";
import * as log from "./util/log";
import mock from "@omtty/webpack/lib/util/mock";
import open from "open";
import path from "path";

export default function runServer(omtDocConfig, argv) {
  const { server = {} } = omtDocConfig || {};
  const app = express();
  if (server.before) {
    server.before(app);
  }
  app.use(express.static(path.resolve(argv.cwd, omtDocConfig.outputPath)));
  app.use(mock(argv));
  if (server.index) {
    app.use((req, res, next) => {
      if (req.path === "/" && req.method.toUpperCase() === "GET") {
        res.redirect(server.index);
      } else {
        next();
      }
    });
  }
  const port = server.port || 3000;
  app.listen(port, () => {
    log.info(`Run app success! port=${port}`);
    open(`http://localhost:${port}`);
  });
}
