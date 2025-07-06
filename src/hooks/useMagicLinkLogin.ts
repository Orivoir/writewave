"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

export function useMagicLinkLogin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const t = useTranslations("Login.Feedback")

  const errorMessage = t("MagicLinkError")
  const successMessage = t("MagicLinkSuccess")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("email", {
      redirect: false,
      email,
    });

    if (result?.error) {
      setMessage(errorMessage);
    } else {
      setMessage(successMessage);
      setEmail("");
    }

    setLoading(false);
  };

  return {
    email,
    setEmail,
    message,
    loading,
    handleSubmit,
  };
}
