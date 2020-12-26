import { Storage } from '@google-cloud/storage';
import * as fs from 'fs';
import * as path from 'path';

const GCLOUD_STORAGE_BUCKET = "panenco-bot";
const storage = new Storage({
  keyFilename: path.join(__dirname, "panenco-project-3a71fc005ae1.json"),
});

const publicUrl = (gcsFileName: string) =>
  `https://storage.googleapis.com/${GCLOUD_STORAGE_BUCKET}/${gcsFileName}`;
const bucket = storage.bucket(GCLOUD_STORAGE_BUCKET);

const uploadFolder = async (pathToUpload: string, destRootDir: string) => {
  const finder = new RecursiveFileFinder();
  const paths = finder.listAllFiles(pathToUpload);
  try {
    await bucket.deleteFiles({ directory: destRootDir, force: true });
  } catch (error) {
    console.log(error);
  }

  await Promise.all(
    paths.map(async (p) => {
      const filename = p.replace(pathToUpload, "").replace("\\", "/");
      const uploadResponse = await bucket.upload(
        p,
        { destination: `${destRootDir}${filename}` },
      );
    }),
  );

  return publicUrl(destRootDir);
};

class RecursiveFileFinder {
  public failedPaths: string[] = [];
  public skippedPaths: string[] = [];
  public modulePaths: string[] = [];

  public listAllFiles(rootPath: string) {
    try {
      const files = fs.readdirSync(rootPath);
      this.readFiles(files, rootPath);
    } catch (err) {
      console.error("Could not list the directory.", err);
      this.failedPaths.push(rootPath);
      return;
    }
    return this.modulePaths;
  }

  private readFiles(files: string[], rootPath: string) {
    files.map((file) => {
      const currentPath = path.join(rootPath, file);

      this.readFileOrDirectory(currentPath);
    });
  }

  private readFileOrDirectory(currentPath: string) {
    try {
      const stat = fs.statSync(currentPath);
      if (stat.isFile()) {
        return this.modulePaths.push(currentPath);
      }
      if (stat.isDirectory()) {
        return this.listAllFiles(currentPath);
      }
    } catch {
      this.failedPaths.push(currentPath);
    }
  }
}

export default uploadFolder;
