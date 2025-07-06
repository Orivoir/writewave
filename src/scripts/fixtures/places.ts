import dotenv from 'dotenv';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';
import User from '@/models/User';
import Ebook from '@/models/Ebook';
import Place from '@/models/Place';
import { faker } from '@faker-js/faker';

dotenv.config({ path: '.env.local' });

const placeTypes = [
  "building", "village", "castle", "forest", "city", "region",
  "country", "dungeon", "ship", "room", "landmark", "natural_feature", "other"
];

const climateTypes = [
  "temperate", "arid", "tropical", "polar", "continental", "mountain", "marine", "other"
];

const importanceLevels = ["primary", "secondary", "tertiary"];

(async () => {
  await dbConnect();

  const user = await User.findOne({ email: 'sam.gabor22@gmail.com' });
  if (!user) throw new Error('Utilisateur sam.gabor22@gmail.com non trouvé. Abort fixtures.');

  const ebooks = await Ebook.find({ author: user._id });
  if (!ebooks.length) throw new Error('Aucun ebook trouvé pour cet utilisateur.');

  for (const ebook of ebooks) {
    const nbPlaces = faker.number.int({ min: 3, max: 6 });
    const places: mongoose.Types.ObjectId[] = [];

    for (let i = 0; i < nbPlaces; i++) {
      // On choisit un parent place aléatoire (ou null) uniquement parmi les lieux déjà créés sur ce ebook
      const parentPlace = places.length > 0 && faker.datatype.boolean()
        ? faker.helpers.arrayElement(places)
        : undefined;

      const placeDoc = new Place({
        ebook: ebook._id,
        name: faker.location.city() + (faker.datatype.boolean() ? ' ' + faker.lorem.word() : ''),
        type: faker.helpers.arrayElement(placeTypes),
        description: faker.lorem.sentences(2),
        parentPlace,
        climate: faker.helpers.arrayElement(climateTypes),
        importance: faker.helpers.arrayElement(importanceLevels),
        notes: faker.lorem.sentences(1),
        createdAt: new Date(),
      });

      await placeDoc.save();
      places.push(placeDoc._id);
    }
  }

  console.log('Fixtures places créées avec succès');
  mongoose.connection.close();
})();
