import dotenv from 'dotenv';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';
import User from '@/models/User';
import Ebook from '@/models/Ebook';
import Note, {NoteType} from '@/models/Note';
import { faker } from '@faker-js/faker';

dotenv.config({ path: '.env.local' });

(async () => {
  await dbConnect();

  const user = await User.findOne({ email: 'sam.gabor22@gmail.com' });
  if (!user) throw new Error('Utilisateur sam.gabor22@gmail.com non trouvé. Abort fixtures.');

  const ebooks = await Ebook.find({ author: user._id });
  if (!ebooks.length) throw new Error('Aucun ebook trouvé pour cet utilisateur.');

  const notes = [];

  for (const ebook of ebooks) {
    const nbNotes = faker.number.int({ min: 3, max: 8 });

    for (let i = 0; i < nbNotes; i++) {
      const note = new Note({
        ebook: ebook._id,
        title: faker.lorem.sentence(3),
        content: `# ${faker.lorem.sentence()}\n\n${faker.lorem.paragraphs(2, '\n\n')}`,
        type: faker.helpers.arrayElement<NoteType>(["idea", "todo", "reminder", "question", "annotation"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      notes.push(note.save());
    }
    console.log(`✅ Added ${nbNotes} notes to ebook#${ebook.id}`)
  }

  await Promise.all(notes);
  console.log('Fixtures notes créées avec succès');
  mongoose.connection.close();
})();
