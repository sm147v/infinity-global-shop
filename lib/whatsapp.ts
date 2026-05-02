export function whatsappLink(phone: string, message: string): string {
  const clean = phone.replace(/\D/g, '');
  const number = clean.startsWith('57') ? clean : `57${clean}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function orderReceivedMessage(name: string, orderNumber: string): string {
  return `Hola ${name}, acabamos de recibir tu pedido ${orderNumber} en Infinity Global Shop. Ya estamos preparando tu paquete con cariño 💛 Te aviso cuando salga en camino.`;
}

export function orderShippedMessage(name: string, orderNumber: string): string {
  return `🚚 Hola ${name}, buenas noticias: tu pedido ${orderNumber} ya va en camino y debería llegarte hoy. Recuerda tener listo el pago si elegiste contraentrega.`;
}

export function orderDeliveredMessage(name: string, orderNumber: string): string {
  return `🌿 Hola ${name}, confirmamos la entrega de tu pedido ${orderNumber}. ¡Esperamos que disfrutes tus productos! Si te animas, déjanos una reseña en nuestro Instagram @infinityglobalshop ✨`;
}
