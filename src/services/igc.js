import S3 from 'aws-sdk/clients/s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

import { AWS_ACCESS_KEY_ID, AWS_SECRET } from '../../config';

const s3 = new S3({
    secretAccessKey: AWS_SECRET,
    accessKeyId: AWS_ACCESS_KEY_ID,
    region: 'eu-central-1'
});

const storage = multerS3({
    s3: s3,
    bucket: 'tcup-igc',
    acl: 'public-read',
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
    },
    key: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const limits = {
    fileSize: 1024 * 1024 * 20
};

const upload = multer({ storage, limits });

export default upload;
