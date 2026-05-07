import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('components/checkout-client.tsx', 'utf8');

const oldBlock = `  // Cuando regresa del mock pago, confirmar y redirigir a gracias
  useEffect(() => {
    const isMockPaid = searchParams.get("mockPaid") === "1";`;

const newBlock = `  // Cuando regresa de Wompi real
  useEffect(() => {
    const wompiId = searchParams.get("id");
    const env = searchParams.get("env");
    if (!wompiId || !env) return;
    const key = "wompi_confirmed_" + wompiId;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    void (async () => {
      try {
        // Consultar el estado de la transacción a Wompi
        const baseUrl = env === "test"
          ? "https://sandbox.wompi.co/v1/transactions/"
          : "https://production.wompi.co/v1/transactions/";
        const res = await fetch(baseUrl + wompiId);
        const data = await res.json();
        const tx = data?.data;
        if (!tx) return;
        const status = tx.status;
        const reference = tx.reference; // "order-123-timestamp"
        const orderId = reference ? Number(reference.split("-")[1]) : null;
        if (!orderId) return;
        // Buscar el orderNumber desde nuestra API
        const orderRes = await fetch("/api/orders/" + orderId);
        const orderData = orderRes.ok ? await orderRes.json() : null;
        const orderNumber = orderData?.orderNumber || "";
        if (status === "APPROVED") {
          saveCart([]);
          window.dispatchEvent(new Event("igs-cart-updated"));
          window.location.href = "/gratitude?orderNumber=" + orderNumber;
        } else if (["DECLINED", "VOIDED", "ERROR"].includes(status)) {
          setError("El pago fue rechazado. Intenta de nuevo o usa otro método.");
        }
      } catch {
        // Silencioso — el webhook ya maneja la confirmación
      }
    })();
  }, [searchParams]);

  // Cuando regresa del mock pago, confirmar y redirigir a gracias
  useEffect(() => {
    const isMockPaid = searchParams.get("mockPaid") === "1";`;

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  writeFileSync('components/checkout-client.tsx', content);
  console.log('✓ Patch Wompi return aplicado');
} else {
  console.log('✗ No se encontró el bloque');
}
