/* istanbul ignore file */
import * as mongodb from 'mongodb';
import * as mongoose from 'mongoose';
import * as multer from 'multer';
import * as GridFsStorage from 'multer-gridfs-storage';

export class Uploader {
  private _storage: GridFsStorage;
  private _multer: multer.Multer;
  private _bucket: mongodb.GridFSBucket;

  constructor(bucketName: string) {
    this._storage = new GridFsStorage({
      url: process.env.DB,
      cache: 'connections',
      file: (_req, _file) => ({ bucketName }),
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    });

    this._multer = multer({ storage: this._storage });
    this._storage.on('connection', () => {
      this._bucket = new mongoose.mongo.GridFSBucket(this._storage.db, {
        bucketName,
      });
    });
  }

  single(fieldName: string) {
    return this._multer.single(fieldName);
  }

  download(_id: string) {
    return this._bucket.openDownloadStream(new mongodb.ObjectID(_id));
  }
}
