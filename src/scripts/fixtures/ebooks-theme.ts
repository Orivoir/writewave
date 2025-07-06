import dotenv from 'dotenv';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';
import User from '@/models/User';
import EbookTheme from '@/models/EbookTheme';
import { faker } from '@faker-js/faker';

dotenv.config({ path: '.env.local' });

(async () => {
  await dbConnect();

  const user = await User.findOne({ email: 'sam.gabor22@gmail.com' });
  if (!user) throw new Error('Utilisateur sam.gabor22@gmail.com non trouvé. Abort fixtures.');

  const themes = [];
  const usedIdentifiers = new Set<string>();

  for (let i = 0; i < 5; i++) {
    let identifier;
    let attempts = 0;

    do {
      const name = faker.lorem.words(2);
      identifier = faker.helpers.slugify(name).toLowerCase();
      attempts++;
    } while (usedIdentifiers.has(identifier) && attempts < 10);

    if (usedIdentifiers.has(identifier)) {
      console.warn(`⚠️ Impossible de générer un identifiant unique après ${attempts} tentatives.`);
      continue;
    }

    usedIdentifiers.add(identifier);

    const theme = new EbookTheme({
      author: user._id,
      name: identifier.replace('-', ' '),
      identifier,
      description: faker.lorem.sentence(),
      fontFamily: faker.helpers.arrayElement(['Georgia, serif', 'Arial, sans-serif', 'Courier, monospace']),
      fontSize: `${faker.number.int({ min: 14, max: 20 })}px`,
      lineHeight: faker.number.float({ min: 1.4, max: 2 }).toFixed(1),
      textColor: faker.color.rgb(),
      titleColor: faker.color.rgb(),
      subtitleColor: faker.color.rgb(),
      linkColor: faker.color.rgb(),
      linkHoverColor: faker.color.rgb(),
      backgroundColor: faker.color.rgb(),
      borderColor: faker.color.rgb(),
      highlightColor: faker.color.rgb(),
      borderRadius: `${faker.number.int({ min: 0, max: 10 })}px`,
      boxShadow: 'none',
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    themes.push(theme.save());
    console.log("✅ New Theme Ebook Added")
  }

  await Promise.all(themes);
  console.log('Fixtures ebook themes créées avec succès');
  mongoose.connection.close();
})();
