<table class="table" style="margin-top: 10px">
    <thead>
    <tr>
        <th>Title</th>
        <th>Last Updated</th>
        <th>Summary</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>CSV Service</td>
        <td>March 10th, 2026</td>
        <td>Manage and process CSV Files</td>
    </tr>
    </tbody>
</table>

# Overview

The CSV service provides functionality for managing and processing CSV Files.

# Javascript API

## Merge

- `svc.csv.merge`

Receives a list of File IDs and return a merged CSV File.

```js
let files = [];
let cursor = sys.data.find('files');
while (cursor.hasNext()) {
  let record = cursor.next();
  files.push({
    record.field('file').id(),
  });
}

let file = svc.csv.merge({ files });
console.log(JSON.stringify(file));
```

# About SLINGR

SLINGR is a low-code rapid application development platform that accelerates development,
with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

# License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
