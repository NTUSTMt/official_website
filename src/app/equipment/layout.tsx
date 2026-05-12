import React from "react";
import { CartProvider } from "@/components/CartProvider";

export default function EquipmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
