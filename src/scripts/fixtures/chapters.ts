import dotenv from 'dotenv';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';
import User from '@/models/User';
import Ebook from '@/models/Ebook';
import Chapter from '@/models/Chapter';
import UserAsset from '@/models/UserAsset';
import { faker } from '@faker-js/faker';

dotenv.config({ path: '.env.local' });

function generateMarkdownContent(imageUrl: string) {
  return `# ${faker.lorem.sentence()}

Voici un paragraphe d’introduction.  
${faker.lorem.paragraph()}

## Sous-titre

- Point important 1
- Point important 2
- Point important 3

> Citation ou note importante.

![Illustration](${imageUrl})

${faker.lorem.paragraphs(2, '\n\n')}

*Fin du chapitre.*`;
}

(async () => {
  await dbConnect();

  const user = await User.findOne({ email: 'sam.gabor22@gmail.com' });
  if (!user) throw new Error('Utilisateur sam.gabor22@gmail.com non trouvé. Abort fixtures.');

  const ebooks = await Ebook.find({ author: user._id });
  if (!ebooks.length) throw new Error('Aucun ebook trouvé pour cet utilisateur.');

  const assets = await UserAsset.find({ user: user._id });
  if (!assets.length) throw new Error('Aucun asset utilisateur trouvé pour insérer dans le markdown.');

  const chaptersPromises = [];

  for (const ebook of ebooks) {
    const nbChapters = faker.number.int({ min: 2, max: 5 });

    for (let order = 1; order <= nbChapters; order++) {
      const title = faker.lorem.words(faker.number.int({ min: 2, max: 6 }));
      const slug = faker.helpers.slugify(title).toLowerCase();
      const featuredAsset = faker.helpers.arrayElement(assets);

      const content = generateMarkdownContent(featuredAsset.url);

      const chapterDoc = new Chapter({
        ebook: ebook._id,
        title,
        slug,
        order,
        content,
        draft: false,
        featuredImageKey: featuredAsset.key,
        featuredImageUrl: featuredAsset.url,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      chaptersPromises.push(chapterDoc.save());
    }
  }

  await Promise.all(chaptersPromises);
  console.log('Fixtures chapters créés avec succès.');
  mongoose.connection.close();
})();
