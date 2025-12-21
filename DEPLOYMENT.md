# Guía de Publicación (Deploy)

## 1. Publicar la Web (Vercel)
Para que tu aplicación sea accesible en internet, lo más fácil y recomendado para Next.js es **Vercel**.

1.  **Sube tu código a GitHub**.
2.  Ve a [Vercel.com](https://vercel.com) y regístrate.
3.  Haz clic en **"Add New Project"**.
4.  Importa tu repositorio de GitHub.
5.  En la configuración, deja todo por defecto (Framework: Next.js).
6.  Haz clic en **"Deploy"**.

¡Listo! En unos minutos tendrás una URL pública (ej: `maturity-360.vercel.app`).

> **Nota importante:** Actualmente la app usa datos simulados "en memoria" (`MockStorage`). Esto significa que si creas un usuario o subes un archivo en la versión publicada, **se borrará** cuando Vercel reinicie el servidor (lo cual pasa frecuentemente). Para guardar datos de verdad, necesitas el paso 2.

---

## 2. Base de Datos Real (Neon)
Tú preguntaste por **Neon**. Neon es una base de datos PostgreSQL Serverless perfecta para este proyecto. Al conectarla, los datos (usuarios, trámites) se guardarán permanentemente.

### Pasos para conectar Neon:
1.  Ve a [Neon.tech](https://neon.tech) y crea una base de datos.
2.  Copia el **Connection String** (ej: `postgres://...`).
3.  En tu proyecto local:
    *   Instala Prisma: `npm install prisma --save-dev`
    *   Inicializa: `npx prisma init`
    *   Configura el archivo `.env` con tu URL de Neon.
4.  **Refactorización requerida**: 
    *   Actualmente el proyecto lee de `lib/data.ts` (Mock).
    *   Hay que cambiar la lógica en `context/AppContext.tsx` para que, en lugar de modificar arrays locales, haga llamadas a una API (que tú crearás) que use Prisma para guardar en Neon.

### ¿Vercel + Neon?
Sí, en el Dashboard de Vercel (Storage tab), puedes añadir una base de datos Neon con un solo clic. Vercel configurará las variables de entorno automáticamente.
