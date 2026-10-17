"use client";

import { useRouter } from "next/navigation";
import AddProductForm from "@/components/AddProductForm";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <AddProductForm
        onBack={() => router.push("/products")}
        onSuccess={() => {
          // Stay on page with success message or allow redirect
        }}
      />
    </div>
  );
}
