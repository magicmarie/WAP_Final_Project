import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Post, Comment } from "./Interfaces";

const readJSON = async (filename: string) => {
    const filePath = join(__dirname, "data",filename);

    const fileContent = await readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
};

const writeJSON = (filename: string, data: Post[] | Comment[]) => {
    const filePath = join(__dirname, "data", filename);

    writeFile(filePath, JSON.stringify(data, null, 2));
};

export { readJSON, writeJSON };
