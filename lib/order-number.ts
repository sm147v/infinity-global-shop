export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `IGS-${year}-${timestamp}${random}`;
}
