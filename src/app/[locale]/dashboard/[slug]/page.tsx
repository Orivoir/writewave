interface PageProps {
  params: { slug: string };
}

export default async function EbookPage({params}: PageProps) {

  const {slug} = params

  return (
    <>
    <h1>Ebook slug: {slug}</h1>
    {/* @TODO: show author */}
    {/* @TODO: show card preview ebook: author, cover image, description, title */}
    {/* @TODO: show status, isPublic, price, number of chapters, number of assets */}
    {/* @TODO: show chaper list */}
    {/* @TODO: change chapter position from drag and drop at chapter list */}
    </>
  )
}