import fs from "node:fs";
import archiver from "archiver";

fs.mkdirSync("./temp", { recursive: true });

export default function create() {
    const outputFileStream = fs.createWriteStream("./temp/compressed.zip");

    const archive = archiver('zip', {
        allowHalfOpen: false,
        zlib: {
            level: 9
        }
    });

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
