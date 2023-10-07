# tsv-parser

`tsv-parser` can convert TSV into JSON 

## Install

```console
$ npm install @smnblmrr/tsv-parser
```

## Example
Begin by setting up a readable stream to the TSV file you intend to parse. Once done, initiate `TsvParser` and direct the stream to flow through it.

Imagine you're working with a TSV file named `data.tsv`. The content might look something like this:

```
NAME    AGE
Daffy Duck  24
Bugs Bunny  22
```

Here's how you'd extract and display the information using TsvParser:

```js
const { createReadStream } = require("node:fs");
const TsvParser = require("@smnblmrr/tsv-parser");

let source = createReadStream("data.tsv");
let data = [];

source
  .pipe(TsvParser())
  .on("data", (record) => {
    data.push(record);
  })
  .on("end", () => {
    console.log(data);
  });
```

When you run the above script, you can expect an output resembling:
```
[
    { NAME: 'Daffy Duck', AGE: '24' }
    { NAME: 'Bugs Bunny', AGE: '22' }
]
```

## Options
Type: `Object`
#### headers

Type: `Array[String] | Boolean`

The headers option determines how the TSV rows are mapped to object properties. If you don't provide a specific headers option, the tsv-parser assumes that the first row in your TSV file contains the headers.

By setting the headers option to false, you're telling the parser that the first row doesn't contain headers. Instead, the parser will use the column indices as keys.