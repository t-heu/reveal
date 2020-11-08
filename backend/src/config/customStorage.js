function FirebaseStorage(opts) {
  console.log(opts, '- root');
  switch (typeof opts.bucket) {
    case 'string':
      this.bucket = opts.bucket;
      break;
    default:
      throw new TypeError('aaa');
  }
}

function collect(storage, req, file, cb) {
  console.log(storage, req, file, cb);
  cb(null, {
    bucket: 'currentSize',
  });
}

FirebaseStorage.prototype._handleFile = (req, file, cb) => {
  collect(this, req, file, function (err, opts) {
    console.log(req, file);
    if (err) return cb(err);

    cb(null, {
      bucket: 'currentSize',
    });
  });
};

FirebaseStorage.prototype._removeFile = (req, file, cb) => {
  console.log(this, '- _removeFile');
};

export { FirebaseStorage };

// module.exports = function(opts: any) {
//   return new FirebaseStorage(opts);
// };
