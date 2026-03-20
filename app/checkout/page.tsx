import { Suspense } from "react";
import { CheckoutClient } from "@/components/checkout-client";

export default function CheckoutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <Suspense fallback={<p>Cargando checkout...</p>}>
        <CheckoutClient />
      </Suspense>
    </section>
  );
}
