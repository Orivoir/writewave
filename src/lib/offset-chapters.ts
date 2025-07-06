import Chapter from '@/models/Chapter';
import mongoose from 'mongoose';

/**
 * Décale tous les chapitres de l’ebook `ebookId` ayant un ordre >= `fromOrder`,
 * en incrémentant leur ordre de 1 pour faire de la place à un nouveau chapitre.
 * @param ebookId - ID de l’ebook concerné
 * @param fromOrder - ordre à partir duquel on décale les chapitres
 */
export async function offsetChapters(
  ebookId: mongoose.Types.ObjectId | string,
  fromOrder: number
) {
  await Chapter.updateMany(
    { ebook: ebookId, order: { $gte: fromOrder } },
    { $inc: { order: 1 } }
  );
}
