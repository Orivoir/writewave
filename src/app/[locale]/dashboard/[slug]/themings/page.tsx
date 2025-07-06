interface PageProps {
  params: {
    slug: string;
  };
}

export default function ThemingsEbookPage({params}: PageProps) {

  const {slug} = params;

  return (
    <>
    {/* @TODO: show preview ebook, show preview "random" chapter */}
    {/* @TODO: Edit ebook theme */}
    </>
  )
}