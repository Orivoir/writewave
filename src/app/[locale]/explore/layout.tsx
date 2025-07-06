interface Props {
  children: React.ReactNode;
}

export default function ExploreLayout({children}: Props) {

  return (
    <>
    {/* @TODO: search header */}
    <header></header>

    <main>{children}</main>
    </>
  )
}