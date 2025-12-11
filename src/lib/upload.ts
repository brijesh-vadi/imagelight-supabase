import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const S3_BUCKET = process.env.AWS_S3_BUCKET ?? "";
const S3_REGION = process.env.AWS_REGION ?? "";

export async function uploadImage(file: File, folder: string): Promise<string> {
  const id = uuid();
  const key = `${folder}/${id}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

export async function uploadImages(
  files: File[],
  folder: string,
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadImage(file, folder));
  return Promise.all(uploadPromises);
}

export async function uploadDocument(
  file: File,
  folder: string,
): Promise<string> {
  return uploadImage(file, folder);
}

export async function deleteFromS3(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET ?? "",
    Key: key,
  });
  await s3.send(command);
}
