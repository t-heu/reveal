import { Request, Response } from 'express';
import path from 'path';
import Jimp from 'jimp';
import fs from 'fs';
import { container } from 'tsyringe';
import { Storage } from '@google-cloud/storage';

import UpdateUserAvatarUseCase from './UpdateUserAvatarUseCase';
import { BaseController } from '../../../../shared/infra/BaseController';

const storage = new Storage({
  projectId: process.env.FIREBASE_STORAGE_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET as string);

export class UpdateUserAvatarController extends BaseController {
  constructor() {
    super();
  }

  async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const userID = req.user.id;
      console.log(req.file);

      const user = container.resolve(UpdateUserAvatarUseCase);
      const fileOfficialName = await user.execute({ id: userID });
      req.file.originalname = fileOfficialName;

      // Create a new blob in the bucket and upload the file data.
      const blob = bucket.file(req.file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          cacheControl: 'no-cache',
        },
      });

      blobStream.on('error', err => {
        return this.fail(res, err);
      });

      /* blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        );
        console.log(publicUrl);
      }); */

      blobStream.end(req.file.buffer);

      if (process.env.STORAGE_DRIVER === 'disk') {
        Jimp.read(req.file.path)
          .then(lenna => {
            return lenna
              .resize(250, 250)
              .quality(60)
              .write(path.resolve(req.file.destination, fileOfficialName));
          })
          .catch(err => {
            console.log(err);
            return this.fail(res, err);
          });

        fs.unlinkSync(req.file.path);
      }

      return this.created(res);
    } catch (err) {
      console.log(err);
      return this.fail(res, err);
    }
  }
}
