import dotenv from 'dotenv';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';
import User from '@/models/User';
import Ebook from '@/models/Ebook';
import EbookTheme from '@/models/EbookTheme';
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

const fixturesEbooks = async () => {
  await dbConnect();

  const user = await User.findOne({ email: 'sam.gabor22@gmail.com' });
  if (!user) throw new Error('Utilisateur sam.gabor22@gmail.com non trouvé. Abort fixtures.');

  const themes = await EbookTheme.find({});
  if (!themes.length) throw new Error('Aucun thème trouvé en base. Abort fixtures.');

  const ebooks = [];
  for (let i = 0; i < 10; i++) {
    const title = faker.lorem.words(4);
    const slug = faker.helpers.slugify(title).toLowerCase();
    const description = faker.lorem.sentences(2);
    const visibility = faker.helpers.arrayElement(['draft', 'private', 'public', 'restricted', 'archived']);
    const isForSale = faker.datatype.boolean();
    const theme = faker.helpers.arrayElement(themes);

    const imageUrl = faker.image.urlLoremFlickr({ category: 'book' });
    const response = await fetch(imageUrl);
    const imageBuffer = Buffer.from(await response.arrayBuffer());

    const key = `ww/${faker.string.uuid()}.jpg`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_EBOOK_COVERS!,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
    }));

    const coverImageUrl = `${process.env.S3_PUBLIC_URL}/${process.env.S3_BUCKET_EBOOK_COVERS}/${key}`;
    console.log("✅ S3 cover image upload ")

    const ebook = new Ebook({
      author: user._id,
      title,
      slug,
      description,
      visibility,
      isForSale,
      theme: theme._id,
      tags: faker.lorem.words(3).split(' '),
      coverImage: coverImageUrl,
      coverImageKey: key,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    ebooks.push(ebook.save());
    console.log("✅ New Ebook Added")
  }

  await Promise.all(ebooks);
  console.log('Fixtures ebooks créées avec succès');
  mongoose.connection.close();
};

fixturesEbooks();
