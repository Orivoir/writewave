import dotenv from 'dotenv';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';
import User from '@/models/User';
import UserAsset from '@/models/UserAsset';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { faker } from '@faker-js/faker';
import fetch from 'node-fetch';

dotenv.config({ path: '.env.local' });

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const fixturesUserAssets = async () => {
  await dbConnect();

  const user = await User.findOne({ email: 'sam.gabor22@gmail.com' });
  if (!user) throw new Error('Utilisateur sam.gabor22@gmail.com non trouvé. Abort fixtures.');

  const assetsPromises = [];

  for (let i = 0; i < 10; i++) {
    const imageUrl = faker.image.urlLoremFlickr({ category: 'nature' });
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`Erreur lors du fetch de l'image: ${response.statusText}`);
      continue;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const key = `user-assets/${faker.string.uuid()}.jpg`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_LIBRARY_USER!,
        Key: key,
        Body: buffer,
        ContentType: 'image/jpeg',
      }),
    );
    console.log(`✅ Image uploadée sur S3 avec la clé: ${key}`);

    const userAsset = new UserAsset({
      user: user._id,
      filename: `asset_${faker.string.uuid()}.jpg`,
      key,
      url: `${process.env.S3_PUBLIC_URL}/${process.env.S3_BUCKET_LIBRARY_USER}/${key}`,
      size: buffer.length,
      mimeType: 'image/jpeg',
      createdAt: new Date(),
    });

    assetsPromises.push(userAsset.save());
  }

  await Promise.all(assetsPromises);
  console.log('Fixtures user assets créés avec succès');
  mongoose.connection.close();
};

fixturesUserAssets();
