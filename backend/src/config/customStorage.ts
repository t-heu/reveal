/* eslint consistent-return: "off", @typescript-eslint/no-unused-vars: "off" */

import * as multer from 'multer';
import { Storage, Bucket } from '@google-cloud/storage';
import crypto from 'crypto';

interface ICred {
  keyFilename: string;
  bucket: string;
  projectId: string;
}

export default class MulterGoogleCloudStorage implements multer.StorageEngine {
  private gcobj: Storage;

  private gcsBucket: Bucket;

  private streamOpts: any;

  getFilename(req: any, file: Express.Multer.File, cb: any): void {
    if (
      req.query.filename.match(/(https|http?:\/\/[^\s]+)/g) ||
      req.query.filename === 'no_photo.jpg'
    ) {
      cb(null, `${crypto.randomBytes(16).toString('hex')}-${Date.now()}.jpg`);
    }

    cb(null, req.query.filename);
  }

  getDestination(
    req: Express.Request,
    file: Express.Multer.File,
    cb: any,
  ): void {
    cb(null, '');
  }

  constructor(opts: ICred) {
    if (!opts.bucket) {
      throw new Error(
        'You have to specify bucket for Google Cloud Storage to work.',
      );
    }

    if (!opts.projectId) {
      throw new Error(
        'You have to specify project id for Google Cloud Storage to work.',
      );
    }

    if (!opts.keyFilename) {
      throw new Error(
        'You have to specify credentials key file for Google Cloud Storage to work.',
      );
    }

    this.streamOpts = {
      resumable: false,
      metadata: {
        cacheControl: 'no-cache',
      },
    };

    this.gcobj = new Storage({
      projectId: opts.projectId,
      keyFilename: opts.keyFilename,
    });

    this.gcsBucket = this.gcobj.bucket(opts.bucket);
  }

  _handleFile = (req: any, file: Express.Multer.File, cb: any): void => {
    this.getDestination(req, file, (err: any, destination: any) => {
      if (err) {
        return cb(err);
      }

      this.getFilename(req, file, (err: any, filename: any) => {
        if (err) {
          return cb(err);
        }

        if (filename === 'no_photo.jpg') return;

        const gcFile = this.gcsBucket.file(filename);

        file.stream
          .pipe(gcFile.createWriteStream(this.streamOpts))
          .on('error', (err: any) => cb(err))
          .on('finish', () =>
            cb(null, {
              filename,
            }),
          );
      });
    });
  };

  _removeFile = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: any,
  ): void => {
    const gcFile = this.gcsBucket.file(file.filename);
    gcFile.delete();
  };
}

export function firebaseStorageEngine(opts: ICred): MulterGoogleCloudStorage {
  return new MulterGoogleCloudStorage(opts);
}
