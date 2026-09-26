# Integración visual de Lovable + funciones de TecniVision

Esta versión conserva el backend funcional del proyecto original en Next.js y Prisma, y adopta la apariencia visual del prototipo generado con Lovable.

## Funciones conservadas

- Catálogo conectado a Prisma/MySQL.
- Catálogos independientes por sede.
- Filtros por categoría.
- Detalle de producto.
- Carrito persistente con Zustand/localStorage.
- Creación de solicitudes y envío por WhatsApp.
- Inicio y cierre de sesión administrativo.
- Panel para crear, editar y eliminar productos.
- Carga y optimización de imágenes.
- Protección de rutas administrativas y rate limiting.

## Mejoras visuales integradas

- Hero moderno con gradiente.
- Navegación responsive y menú móvil.
- Contador del carrito.
- Tarjetas modernas de productos.
- Inicio con categorías y productos destacados reales.
- Página de producto rediseñada.
- Selector visual de sedes.
- Footer y acceso administrativo.
- Idioma y metadatos configurados para Colombia.

## Ejecución

1. Copia `.env.example` como `.env` y completa las variables.
2. Ejecuta `npm install`.
3. Ejecuta `npm run db:generate`.
4. Ejecuta `npm run db:migrate`.
5. Ejecuta `npm run db:seed`.
6. Ejecuta `npm run dev`.

La compilación de producción fue verificada con `npm run build`.
