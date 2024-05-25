import fs from "node:fs";
import archiverZipEncrypted from "archiver-zip-encrypted";
import archiver, { type ArchiverOptions, type Format } from "archiver";

fs.mkdirSync("./temp", { recursive: true });

const format = "zip-encrypted" as Format;

archiver.registerFormat(format, archiverZipEncrypted);

export default function createEncrypted() {
    const outputFileStream = fs.createWriteStream("./temp/compressed-encrypted.zip");

    const archive = archiver(format, {
        allowHalfOpen: false,
        zlib: {
            level: 9
        },
        encryptionMethod: "zip20",
        password: "t3st"
    } as ArchiverOptions);

    archive.pipe(outputFileStream);

    archive.file("./package.json", { name: "package.json" });

    archive.on("error", (e) => {
        console.error("Archiver error, " + e.message);
    });

    archive.on("finish", () => {
        console.info("Zip process finished");
        archive.end();
    });

    outputFileStream.on("finish", () => {
        console.info("File saved");
    });

    archive.finalize() // start process
        .catch(err => console.error(err));
}
