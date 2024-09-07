const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const multer = require("multer");
const multerS3 = require("multer-s3");
const crypto = require("crypto");

require("dotenv").config();

const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const randomImageName = (bytes) => crypto.randomBytes(bytes).toString("hex");

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucket,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, randomImageName(16));
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

const generateSignedUrl = async (key) => {
  if (!key) {
    throw new Error("No key provided for S3 delete");
  }

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 86400,
    });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
  }
};

const deleteObject = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting picture", error);
  }
};

module.exports = { upload, generateSignedUrl, deleteObject };
