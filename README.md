# Infinity Global Shop

Base eCommerce pequena con Next.js App Router, Prisma y flujo de pago Wompi (real o mock local).

## Stack

- Next.js (App Router)
- Prisma ORM
- SQLite en desarrollo, opcion PostgreSQL para produccion
- Tailwind CSS
- API routes dentro de Next.js

## Requisitos

- Node.js 20+
- npm 10+

## Configuracion de entorno

Usa `.env.example` como base y crea tu archivo local `.env`:

```bash
cp .env.example .env
```

Archivo `.env` minimo:

```env
DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./dev.db"
APP_URL="http://localhost:3000"

# Wompi real (opcional en local)
WOMPI_PUBLIC_KEY=""
WOMPI_INTEGRITY_KEY=""

# Obligatorio en produccion: usar secretos robustos
WOMPI_WEBHOOK_SECRET="dev_only_replace_with_strong_secret_before_prod"
ADMIN_TOKEN="dev_only_replace_with_strong_admin_token"

# Opcional: rate limit persistente
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

## Arranque rapido

```bash
npm install
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

## Flujo principal

1. El cliente agrega productos al carrito (localStorage).
2. En checkout se crea la orden por `POST /api/orders`.
3. Se inicia pago por `POST /api/payments`.
4. Wompi redirige de vuelta a checkout o webhook actualiza estado de pago.
5. Admin gestiona estado de entrega (`PENDING`, `ON_ROUTE`, `DELIVERED`).

## Seguridad implementada

- Validacion de payloads con Zod
- Sanitizacion de texto en backend
- Verificacion de firma en webhook Wompi
- Recalculo de precios desde base de datos (no se confia en cliente)
- Transaccion Prisma para evitar inconsistencias de stock
- Admin protegido por sesion con token
- Endpoints criticos con validacion de origen y rate limit
- Soporte de rate limit persistente con Upstash (fallback en memoria si no esta configurado)

## Acceso admin

1. Configura `ADMIN_TOKEN` en `.env`.
2. Ingresa a `/admin/login`.
3. Introduce el token para crear sesion admin.
4. Accede a `/admin` para gestionar ordenes.
5. Usa el boton `Cerrar sesion` para invalidar la cookie admin.

## Endpoints clave

- `GET /api/products`
- `POST /api/orders`
- `GET /api/orders` (solo admin)
- `PATCH /api/orders/:id/status` (solo admin)
- `POST /api/payments`
- `POST /api/payments/confirm` (solo mock local)
- `POST /api/webhook/wompi`

## Tests

Ejecutar suite minima de regresion:

```bash
npm run test
```

Incluye pruebas de:

- validacion de payload de ordenes
- firma de webhook Wompi
- rate limiting en memoria

## Notas de produccion

- Reemplazar todos los secretos `dev_only_*`.
- Configurar `DATABASE_PROVIDER="postgresql"` y su `DATABASE_URL` real.
- Activar claves reales de Wompi y URL publica para webhook.
- Mantener `NODE_ENV=production` para deshabilitar confirmacion manual mock.

Checklist de seguridad adicional en `SECURITY.md`.
