const { Readable } = require("node:stream");
const TsvParser = require("./index");
const t = require("tap");

t.test("TsvParser test", (t) => {
  t.plan(1);
  let result = [];
  const sampleInput = "name\tage\tcity\nJohn\t30\tNew York\nJane\t25\tLondon";
  const expectedOutput = [
    { name: "John", age: "30", city: "New York" },
    { name: "Jane", age: "25", city: "London" },
  ];

  const readable = new Readable({
    read() {
      this.push(sampleInput);
      this.push(null);
    },
  });

  readable
    .pipe(TsvParser())
    .on("data", (chunk) => {
      result.push(chunk);
    })
    .on("end", () => {
      t.same(result, expectedOutput, "should parse TSV correctly");
    });
});

t.test("Custom header", (t) => {
  t.plan(1);
  let result = [];
  const sampleInput = "name\tage\tcity\nJohn\t30\tNew York\nJane\t25\tLondon";
  const expectedOutput = [
    { A: "name", B: "age", C: "city" },
    { A: "John", B: "30", C: "New York" },
    { A: "Jane", B: "25", C: "London" },
  ];

  const readable = new Readable({
    read() {
      this.push(sampleInput);
      this.push(null);
    },
  });

  readable
    .pipe(TsvParser({ headers: ["A", "B", "C"] }))
    .on("data", (chunk) => {
      result.push(chunk);
    })
    .on("end", () => {
      t.same(result, expectedOutput, "should parse TSV correctly with custom header");
    });
});

t.test("Headers false", (t) => {
  t.plan(1);
  let result = [];
  const sampleInput = "name\tage\tcity\nJohn\t30\tNew York\nJane\t25\tLondon";
  const expectedOutput = [
    { 0: "name", 1: "age", 2: "city" },
    { 0: "John", 1: "30", 2: "New York" },
    { 0: "Jane", 1: "25", 2: "London" },
  ];

  const readable = new Readable({
    read() {
      this.push(sampleInput);
      this.push(null);
    },
  });

  readable
    .pipe(TsvParser({ headers: false }))
    .on("data", (chunk) => {
      result.push(chunk);
    })
    .on("end", () => {
      t.same(result, expectedOutput, "should parse TSV correctly with custom header");
    });
});
