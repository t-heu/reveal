import Jimp from 'jimp';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { Storage } from '@google-cloud/storage';

import { Storage_Types, tmpFolder } from './upload';

export class UploadStorage {
  filename: string;

  file: string;

  constructor() {
    this.file = tmpFolder;
  }

  storage(filename?: string): string {
    this.filename =
      filename || `${crypto.randomBytes(16).toString('hex')}-${Date.now()}.jpg`;
    this[process.env.STORAGE_DRIVER as Storage_Types]();
    return filename as string;
  }

  s3(): void {
    console.log('s3');
  }

  firebase_storage(): void {
    const gcobj = new Storage({
      projectId: process.env.FIREBASE_STORAGE_PROJECT_ID as string,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS as string,
    });

    const gcsBucket = gcobj.bucket(
      process.env.FIREBASE_STORAGE_BUCKET as string,
    );
    const gcFile = gcsBucket.file(this.filename);

    fs.readFile(path.resolve(this.file, 'no_photo.jpg'), (err, data) => {
      if (err) throw err;
      const str = data.toString('base64');
      const bufferFile = Buffer.from(str, 'base64');

      gcFile
        .createWriteStream({
          resumable: false,
          metadata: {
            cacheControl: 'no-cache',
          },
        })
        .end(bufferFile);
      // .on('error', (err: any) => console.log(err))
      // .on('finish', () => console.log('ok'));
    });
  }

  disk(): void {
    Jimp.read(path.resolve(this.file, 'no_photo.jpg'))
      .then(lenna => {
        return lenna
          .resize(250, 250)
          .quality(60)
          .write(path.resolve(this.file, this.filename));
      })
      .catch(err => {
        console.log(err);
      });
  }
}
