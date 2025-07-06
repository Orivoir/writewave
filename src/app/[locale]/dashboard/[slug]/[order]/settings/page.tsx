interface PageProps {
  params: {
    slug: string;
    order: string; // toujours string dans params
  };
}

export default function SettingsChapterPage({params}: PageProps) {

  const {slug, order} = params;

  return (
    <>
      {/* @TODO: set title chapter  */}
      {/* @TODO: show theming */}
      {/* @TODO: order chapter */}
      {/* @TODO: Toggle draft mode */}
      {/* @TODO: Toggle images public */}
      {/* @TODO: remove chapter */}
    </>
  )
}