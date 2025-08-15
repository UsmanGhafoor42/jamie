"use client"; // ensures client-side redirect will always run

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/add-product");
  }, [router]);

  return null; // nothing to render
}
