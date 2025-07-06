interface PageProps {
  params: {
    slug: string;
  };
}

export default function SettingsThemingsEbookPage({params}: PageProps) {

  const {slug} = params;

  return (
    <>
    {/* @TODO: set Identifier (name of theme required) */}
    {/* @TODO: set description */}
    {/* @TODO: toggle isPublic */}
    {/* @TODO: set preview image */}
    {/* @TODO: remove/reset theme */}
    </>
  )
}