import dotenv from 'dotenv';
import multer, { StorageEngine } from 'multer';
import { Request } from 'express';
import path from 'path';
import crypto from 'crypto';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
// import { Storage } from '@google-cloud/storage';

import { AppError } from '../shared/core/AppError';
// import { FirebaseStorage } from './customStorage.js';

dotenv.config();

const tmpFolder = path.join(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk' | 'firebase_storage';
  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;

    limits: {
      fileSize: number;
    };

    fileFilter(): void;
  };
}

function MyCustomStorage(opts: any) {
  console.log(opts);
}

const storageTypes = {
  disk: multer.diskStorage({
    destination: path.resolve(tmpFolder, 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        // @ts-ignore
        if (err) cb(err);

        const filename = `${hash.toString('hex')}-${Date.now()}-${
          file.originalname
        }`;
        return cb(null, filename);
      });
    },
  }),

  firebase_storage: MyCustomStorage({
    bucket: 'app',
    projectId: 'app',
    keyFilename: 'app',
  }),

  s3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.AWS_BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const filename = `${hash.toString('hex')}-${Date.now()}-${
          file.originalname
        }`;
        return cb(null, filename);
      });
    },
  }),
};

enum Storage_Types {
  s3 = 's3',
  disk = 'disk',
  firebase_storage = 'firebase_storage',
}

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: storageTypes[process.env.STORAGE_DRIVER as Storage_Types],
    limits: {
      fileSize: 1 * 1024 * 1024,
    },
    fileFilter: (req: Request, file: any, cb: any) => {
      const alowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png'];

      if (alowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new AppError('incorrect image format'));
      }
    },
  },

  // config: {
  //   disk: {},
  //   aws: {
  //     bucket: 'app',
  //   },
  // },
} as IUploadConfig;
