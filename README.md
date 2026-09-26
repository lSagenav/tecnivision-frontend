# Tecnivision Frontend

Frontend independiente en Next.js + React. Ya no contiene Prisma, credenciales de DB, Cloudinary ni lógica de persistencia.

## Inicio local
1. Copia `.env.example` a `.env.local`.
2. `npm install`
3. `npm run dev`
4. Abre `http://localhost:3000`.

El backend debe estar ejecutándose en `http://localhost:4000` (o ajusta `NEXT_PUBLIC_API_URL`).

## Repositorio y ejecución independiente

Este repositorio corresponde a `tecnivision-frontend`. Usa Node.js 24 LTS. Se conecta al backend por HTTP; no necesita sus archivos locales.

- Instalación reproducible: `npm ci`.
- Compilación: `npm run build`.
- Inicio en producción: `npm start`.
- Pruebas: `npx tsx --test tests/cart-options.test.ts tests/cloudinary-image.test.ts`.

Configura `NEXT_PUBLIC_API_URL` con la URL HTTPS pública del backend, terminada en `/api`, antes de compilar. Configura también `NEXT_PUBLIC_WHATSAPP_PHONE` si quieres cambiar el número alternativo. Estas variables son públicas; no coloques contraseñas, claves de Cloudinary ni credenciales de la base de datos aquí.

El backend debe permitir el dominio del frontend mediante `FRONTEND_URL`. El catálogo y el login requieren que la API esté disponible. Para el login en producción, usa dominios HTTPS compatibles con la cookie `SameSite=Lax`, por ejemplo `tienda.ejemplo.com` y `api.ejemplo.com`; si se despliegan en sitios distintos, hay que adaptar la configuración de autenticación.

Los archivos `.env.local` y demás secretos no se incluyen en Git. En PowerShell puedes usar `npm.cmd` si la política de ejecución bloquea `npm.ps1`.
