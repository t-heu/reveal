import dotenv from 'dotenv';
import multer, { StorageEngine } from 'multer';
import { Request } from 'express';
import path from 'path';
import crypto from 'crypto';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import Jimp from 'jimp';
import fs from 'fs';

import { AppError } from '../shared/core/AppError';
import { firebaseStorageEngine } from './customStorage';

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

const storageTypes = {
  disk: multer.diskStorage({
    destination: path.resolve(tmpFolder, 'uploads'),
    filename: (req: any, file, cb) => {
      // @ts-ignore
      if (err) cb(err);

      const filename =
        req.query.filename.match(/(https|http?:\/\/[^\s]+)/g) ||
        req.query.filename === 'no_photo.jpg'
          ? `${crypto.randomBytes(16).toString('hex')}-${Date.now()}.jpg`
          : req.query.filename;

      Jimp.read(req.file.buffer)
        .then(lenna => {
          return lenna
            .resize(250, 250)
            .quality(60)
            .write(path.resolve(req.file.destination, filename));
        })
        .catch(err => {
          console.log(err);
          // @ts-ignore
          cb(err);
        });

      fs.unlinkSync(req.file.path);

      return cb(null, filename);
    },
  }),

  firebase_storage: firebaseStorageEngine({
    projectId: process.env.FIREBASE_STORAGE_PROJECT_ID as string,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS as string,
    bucket: process.env.FIREBASE_STORAGE_BUCKET as string,
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
} as IUploadConfig;
