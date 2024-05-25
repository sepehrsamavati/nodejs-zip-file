import fs from "node:fs";
import path from "node:path";
import unzipper from "unzipper";

export function extractPasswordLess() {
    const outputFileStream = fs.createReadStream("./temp/compressed.zip");

    outputFileStream.on('close', () => {
        console.info('Done');
    });

    outputFileStream.pipe(unzipper.Extract({
        path: "./temp/extracted",
    }));
}

export async function extractWithPassword() {
    const password = "t3st";
    const outputDirectory = "./temp/extracted";
    const rootDirectory = await unzipper.Open.file("./temp/compressed-encrypted.zip");

    const directories = rootDirectory.files.filter(item => item.type === 'Directory');
    const files = rootDirectory.files.filter(item => item.type === 'File');

    for (const directory of directories) {
        await fs.promises.mkdir(path.join(outputDirectory, directory.path), { recursive: true });
    }

    for (const file of files) {
        const data = await file.buffer(password);
        await fs.promises.writeFile(path.join(outputDirectory, file.path), data);
    }
}

/** Returns `package.json` data */
export async function readPackageJson(path: string, password?: string) {
    const rootDirectory = await unzipper.Open.file(path);
    const file = rootDirectory.files.find(file => file.path === 'package.json');
    if (file) {
        try {
            const data = await file.buffer(password);
            console.log(data.toString('utf8'));
            return data;
        } catch (err) {
            if (err instanceof Error) {
                switch (err.message) {
                    case 'MISSING_PASSWORD':
                        console.error("File is password protected");
                        break;
                    case 'BAD_PASSWORD':
                        console.error("Incorrect password");
                        break;
                }
            }
        }
    } else {
        console.log("File not found");
    }
    return null;
}
