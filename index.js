"use strict";
const { Transform } = require("node:stream");

module.exports = TsvParser;
module.exports.default = TsvParser;
module.exports.TsvParser = TsvParser;

function TsvParser(options = {}) {
  function isSameLength(line, header) {
    return line?.length === header?.length;
  }

  function buildObject(line) {
    let headers = options?.headers === false || !isSameLength(line, options.headers) ? line?.map((_, idx) => idx) : options.headers;
    let obj = {};
    for (let i = 0; i < line.length; i++) {
      let header = headers[i];
      if (options?.headers === null) return obj;
      if (options?.headers !== undefined) {
        obj[header] = line[i];
      }
    }
    return obj;
  }

  function groupLine(data) {
    const lines = data.split(/\r?\n|\r/);
    if (options.headers === null || options.headers === undefined) {
      let firstLine = lines.splice(0, 1);
      options.headers = firstLine[0].split("\t");
    }
    const chunk = lines.map((line) => buildObject(line.split("\t")));
    return chunk;
  }

  return new Transform({
    objectMode: true,
    transform(row, _encoding, callback) {
      let data = row.toString();
      let cell = groupLine(data);
      for (let c of cell) {
        this.push(c);
      }
      callback();
    },
  });
}
