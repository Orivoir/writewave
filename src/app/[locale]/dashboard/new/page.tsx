"use client";

import CreateEbook, { DataCreateEbook } from "@/components/CreateEbook";

export default function NewEbookPage() {

  const onSubmitNewEbook = (data: DataCreateEbook) => {


  }

  return (
    <CreateEbook onSubmit={onSubmitNewEbook} />
  )
}