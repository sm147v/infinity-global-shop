import { Suspense } from "react";
import { CheckoutClient } from "@/components/checkout-client";

export const metadata = {
  title: "Finaliza tu compra",
  description: "Pago seguro con Wompi · Visa, Mastercard, PSE, Nequi",
};



export default function CheckoutPage() {
  return (
    <section className="space-y-5">
      <div className="hero-shell p-6 sm:p-7">
        <span className="eyebrow">Checkout protegido</span>
        <h1 className="display-title mt-3">Finaliza tu compra de forma rapida y segura</h1>
        <p className="mt-3 max-w-2xl muted">
          Revisa tu carrito, completa tus datos y continua al pago con validaciones
          listas para una experiencia confiable.
        </p>
      </div>
      <Suspense fallback={<p>Cargando checkout...</p>}>
        <CheckoutClient />
      </Suspense>
    </section>
  );
}
