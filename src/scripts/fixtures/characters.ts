import dotenv from 'dotenv';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';
import User from '@/models/User';
import Ebook from '@/models/Ebook';
import Character from '@/models/Character';
import { faker } from '@faker-js/faker';

dotenv.config({ path: '.env.local' });

const RELATION_TYPES = ["parent", "child", "sibling", "spouse", "enemy", "friend"] as const;
const GENDERS = ["male", "female", "other", "animal"] as const;

(async () => {
  await dbConnect();

  const user = await User.findOne({ email: 'sam.gabor22@gmail.com' });
  if (!user) {
    throw new Error('Utilisateur sam.gabor22@gmail.com non trouvé. Abort fixtures.');
  }

  // Récupérer les ebooks de l'utilisateur
  const ebooks = await Ebook.find({ author: user._id });
  if (!ebooks.length) {
    throw new Error('Aucun ebook trouvé pour l\'utilisateur.');
  }

  for (const ebook of ebooks) {
    // Créer entre 3 et 7 personnages par ebook
    const nbCharacters = faker.number.int({ min: 3, max: 7 });
    const characters = [];

    // Création des personnages
    for (let i = 0; i < nbCharacters; i++) {
      const isAnimal = faker.datatype.boolean();
      const gender = isAnimal ? 'animal' : faker.helpers.arrayElement(GENDERS.filter(g => g !== 'animal'));
      const name = isAnimal
        ? faker.animal.type()
        : faker.person.firstName();

      const description = faker.lorem.sentence();

      const character = new Character({
        ebook: ebook._id,
        name,
        gender,
        description,
        relations: [],
        createdAt: new Date(),
      });

      characters.push(character);      
    }
    console.log(`build ${characters.length} characters for ${ebook.title}`)

    // Save characters to get _id populated
    await Character.insertMany(characters);

    // Génération des relations
    for (const character of characters) {
      // nombre aléatoire de relations pour chaque personnage
      const nbRelations = faker.number.int({ min: 0, max: 3 });
      const relatedIndices = new Set<number>();

      for (let r = 0; r < nbRelations; r++) {
        let targetIndex;
        let tries = 0;
        do {
          targetIndex = faker.number.int({ min: 0, max: characters.length -1 });
          tries++;
        } while ((targetIndex === characters.indexOf(character) || relatedIndices.has(targetIndex)) && tries < 10);

        if (tries >= 10) break;

        relatedIndices.add(targetIndex);
        const targetCharacter = characters[targetIndex];

        // Choisir un type de relation compatible (ex: pas parent d'animal, mais on peut faire simple)
        // Pour simplifier, on prend un type aléatoire
        const type = faker.helpers.arrayElement(RELATION_TYPES);

        // On évite double relation symétrique compliquée ici, on ajoute juste dans le personnage courant
        character.relations.push({
          character: targetCharacter._id,
          type,
        });
      }

      await character.save();
      console.log("Added relations characters")
    }

    console.log("✅ New characters with relations added")
  }

  console.log('Fixtures personnages et relations créées avec succès');
  mongoose.connection.close();
})();
