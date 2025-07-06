// dashboard/[slug]/[order]/page.tsx

interface PageProps {
  params: {
    slug: string;
    order: string; // toujours string dans params
  };
}

export default function ChapterPage({ params }: PageProps) {
  const { slug, order } = params;
  const orderNumber = parseInt(order, 10);

  if (isNaN(orderNumber)) {
    // Tu peux gérer l'erreur ici
    // @TODO: redirect to 404
    return <div>Numéro de chapitre invalide</div>;
  }

  return (
    <>
    {/* @TODO: Edit chapter markdown editor */}
    {/* @TODO: Insert images in chapter */}
    {/* @TODO: add save and undo actions */}
    </>
  );
}
