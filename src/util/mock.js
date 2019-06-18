import path from "path";
import fs from "fs";
export default function createMock(argv) {
  return function(req, res, next) {
    const { cwd } = argv;
    const mockJsPath = path.resolve(cwd, ".omt.mock.js");
    let mockDataJson = {};
    if (fs.existsSync(mockJsPath)) {
      mockDataJson = require(mockJsPath);
    }
    const dataKey = `${req.method.toUpperCase()} ${req.path}`;
    if (mockDataJson[dataKey]) {
      res.json(mockDataJson[dataKey]);
    } else {
      next();
    }
  };
}
