import { readFileSync, writeFileSync } from 'fs';

// Fix 1: lib/wompi.ts — agregar orderNumber a redirect URL
let wompi = readFileSync('lib/wompi.ts', 'utf8');
wompi = wompi.replace(
  `type BuildCheckoutInput = {
  amountInCents: number;
  reference: string;
};`,
  `type BuildCheckoutInput = {
  amountInCents: number;
  reference: string;
  orderNumber?: string;
};`
);
wompi = wompi.replace(
  `export function buildWompiCheckoutUrl({ amountInCents, reference }: BuildCheckoutInput): string {`,
  `export function buildWompiCheckoutUrl({ amountInCents, reference, orderNumber }: BuildCheckoutInput): string {`
);
wompi = wompi.replace(
  `  const redirectUrl = \`\${appUrl}/checkout\`;`,
  `  const redirectUrl = orderNumber ? \`\${appUrl}/gratitude?orderNumber=\${orderNumber}\` : \`\${appUrl}/checkout\`;`
);
writeFileSync('lib/wompi.ts', wompi);
console.log('✓ lib/wompi.ts actualizado');

// Fix 2: api/payments/index.ts — pasar orderNumber
let payments = readFileSync('api/payments/index.ts', 'utf8');
payments = payments.replace(
  `  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, total: true, paymentStatus: true },
  });`,
  `  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, total: true, paymentStatus: true, orderNumber: true },
  });`
);
payments = payments.replace(
  `    paymentUrl = buildWompiCheckoutUrl({ amountInCents, reference });`,
  `    paymentUrl = buildWompiCheckoutUrl({ amountInCents, reference, orderNumber: order.orderNumber });`
);
writeFileSync('api/payments/index.ts', payments);
console.log('✓ api/payments/index.ts actualizado');
