import Chapter from "@/models/Chapter";
import { offsetChapters } from "./offset-chapters";

/**
 * Valide et ajuste la position order pour un nouveau chapitre dans un ebook.
 * Si order est invalide ou hors bornes, le chapitre sera ajouté en dernière position.
 * Si order est valide, décale les chapitres existants à partir de cet ordre.
 *
 * @param ebookId - id de l'ebook auquel appartient le chapitre
 * @param proposedOrder - ordre proposé pour le nouveau chapitre (peut être invalide)
 * @returns order validé (position finale où insérer le chapitre)
 */
export async function getValidChapterOrder(ebookId: string, proposedOrder?: number): Promise<number> {
  const chaptersCount = await Chapter.countDocuments({ ebook: ebookId });

  if (
    typeof proposedOrder !== "number" ||
    proposedOrder < 1 ||
    proposedOrder > chaptersCount + 1
  ) {
    // ordre non renseigné ou invalide : ajout en fin de liste
    return chaptersCount + 1;
  }

  // décaler les chapitres à partir de l'ordre proposé pour faire de la place
  await offsetChapters(ebookId, proposedOrder)

  return proposedOrder;
}
