# Jennyfer — Boutique de Ropa & Moda Exclusiva ✨

Plataforma de comercio electrónico y panel de control/facturación para la tienda de ropa y moda **Jennyfer**, basada en Next.js App Router, Prisma ORM y PostgreSQL.

---

## 🚀 1. Cómo probar el proyecto en Local (Tu Computadora)

### Requisitos previos:
- **Node.js** (versión 18 o superior)
- Base de datos **PostgreSQL** (puedes usar una base de datos gratuita en [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), Render PostgreSQL o local).

### Pasos:

1. **Abrir la terminal en la carpeta del proyecto:**
   ```bash
   cd c:\Users\Admin\.gemini\antigravity-ide\scratch\jennyfer
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Crear el archivo `.env`:**
   Crea un archivo llamado `.env` en la raíz de `jennyfer/` con tu URL de conexión de PostgreSQL:
   ```env
   DATABASE_URL="postgresql://usuario:password@host:5432/nombre_bd?sslmode=require"
   ```
   *(Opcional: Si deseas subida de imágenes a la nube, puedes agregar las claves de Cloudinary)*:
   ```env
   CLOUDINARY_CLOUD_NAME="tu_cloud_name"
   CLOUDINARY_API_KEY="tu_api_key"
   CLOUDINARY_API_SECRET="tu_api_secret"
   ```

4. **Sincronizar la base de datos con Prisma:**
   Este comando creará automáticamente todas las tablas necesarias (Productos, Marcas, Categorías, Pedidos, Configuración):
   ```bash
   npx prisma db push
   ```

5. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

6. **Abrir en tu navegador:**
   - **Tienda pública:** [http://localhost:3000](http://localhost:3000)
   - **Panel de administración:** [http://localhost:3000/admin](http://localhost:3000/admin)
     *(Credenciales por defecto: Usuario `admin`, Contraseña `admin`)*

---

## 🌐 2. Cómo Subir el Proyecto a Render (Despliegue en la Nube)

Render permite alojar tanto la aplicación Next.js (Web Service) como la base de datos PostgreSQL de forma gratuita o muy económica.

### Paso A: Subir el código a GitHub
1. Inicializa Git en la carpeta del proyecto (si no lo has hecho):
   ```bash
   git init
   git add .
   git commit -m "Inicializar proyecto Jennyfer Boutique"
   ```
2. Crea un repositorio nuevo en tu cuenta de GitHub (por ejemplo `jennyfer-shop`).
3. Conecta y sube tu código:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/jennyfer-shop.git
   git branch -M main
   git push -u origin main
   ```

### Paso B: Crear la Base de Datos PostgreSQL en Render
1. Entra a [dashboard.render.com](https://dashboard.render.com).
2. Haz clic en **New +** y selecciona **PostgreSQL**.
3. Asígnale un nombre (ej. `jennyfer-db`).
4. Selecciona la región más cercana y el plan (Free).
5. Haz clic en **Create Database**.
6. Una vez creada, copia la **Internal Database URL** (o **External Database URL**).

### Paso C: Crear el Web Service en Render
1. En Render, haz clic en **New +** y selecciona **Web Service**.
2. Conecta tu repositorio de GitHub `jennyfer-shop`.
3. Configura los siguientes campos:
   - **Name:** `jennyfer` (o el nombre que prefieras).
   - **Runtime:** `Node`.
   - **Build Command:**
     ```bash
     npm install && npx prisma generate && npx prisma db push && npm run build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
4. En la sección **Environment Variables** (Variables de Entorno), añade:
   - `DATABASE_URL`: La URL de la base de datos que copiaste en el Paso B.
   - `NODE_ENV`: `production`
   - *(Opcional)* Si usas Cloudinary para fotos:
     - `CLOUDINARY_CLOUD_NAME`
     - `CLOUDINARY_API_KEY`
     - `CLOUDINARY_API_SECRET`
5. Haz clic en **Deploy Web Service**.

### Paso D: ¡Verlo Arriba!
- Render compilará el proyecto y generará una URL pública gratuita, por ejemplo:
  `https://jennyfer.onrender.com`
- Al entrar podrás usar la tienda y acceder a `/admin` para cargar tus prendas, categorías (Vestidos, Blusas, Pantalones, etc.), marcas y configurar el número de WhatsApp para recibir pedidos.
