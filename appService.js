const svc = require('@slingr/slingr-services');
const fs = require('node:fs');
const csv = require('csv');;
const { randomUUID } = require('node:crypto');

svc.hooks.onSvcStart = () => {
    svc.logger.info('CSV Service has started');
}

svc.hooks.onSvcStop = (cause) => {
    svc.logger.info('CSV Service is stopping.');
}

svc.functions.merge = async ({ params }) => {
    let { files } = params;
    let fileName = `${randomUUID()}.csv`;
    console.log(`Merging ${files.length} files to ${fileName}`);
    await merge(files, fileName);
    console.log(`Reading ${fileName}`);
    let output = fs.readFileSync(fileName);
    console.log(`Uploading ${fileName}`);
    let file = await svc.files.upload(fileName, output);
    console.log(`Uploaded File ${file}`);
    fs.unlinkSync(fileName);
    console.log(`Removed ${fileName}`);
    return file;
};

async function merge(inputFiles, outputFile) {
    const stringifier = csv.stringify({ header: true });
    fs.writeFileSync(outputFile, '');
    const writableStream = fs.createWriteStream(outputFile);

    // Pipe the stringifier output to our final file
    stringifier.pipe(writableStream);

    // Process each file sequentially
    for (const fileId of inputFiles) {
        let data = await svc.files.download(fileId);
        let path = `/tmp/${fileId}.csv`;
        fs.writeFileSync(path, data);
        console.log(`Downloaded ${fileId} to ${path}`);

        await new Promise((resolve, reject) => {
            const parser = csv.parse({
                columns: true,
                skip_empty_lines: true,
            });
            fs.createReadStream(path)
                .pipe(parser)
                .on('data', (record) => {
                    // Write the object to the stringifier
                    stringifier.write(record);
                })
                .on('end', () => {
                    resolve(); // File finished processing
                })
                .on('error', (err) => {
                    reject(err);
                });
        });
        fs.unlinkSync(path);
        console.log(`Removed ${path}`);
    }

    stringifier.end();

    // Wait for the file system write stream to finish saving
    return new Promise((resolve, reject) => {
        writableStream.on('finish', () => {
            console.log(`Successfully merged into ${outputFile}`);
            resolve();
        });
        writableStream.on('error', reject);
    });
}

svc.start();
