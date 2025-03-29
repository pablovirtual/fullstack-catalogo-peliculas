# Documentación de Despliegue - Catálogo de Películas

Este documento explica la configuración y los cambios realizados para facilitar el despliegue de la aplicación "Catálogo de Películas" en Render.com.

## Estructura del Proyecto

El proyecto tiene una estructura full-stack:

- **Frontend**: Aplicación Angular en `/frontend/catalogo-peliculas`
- **Backend**: API Laravel en `/backend/catalogo`
- **Base de datos**: MySQL 

## Cambios Realizados

### 1. Configuración de Render (render.yaml)

Se ha creado un archivo `render.yaml` en la raíz del proyecto que define:

- **Servicio Backend (Laravel API)**:
  - Nombre: `catalogo-api`
  - Entorno: PHP
  - Directorio raíz: `backend/catalogo`
  - Comandos de construcción y arranque
  - Variables de entorno para conexión a base de datos y configuración

- **Servicio Frontend (Angular)**:
  - Nombre: `catalogo-frontend`
  - Entorno: Node.js
  - Directorio raíz: `frontend/catalogo-peliculas`
  - Script de construcción que incluye la sustitución de la URL de la API
  - Comandos para servir la aplicación compilada

- **Base de Datos**:
  - MySQL configurada con nombre de usuario y base de datos

### 2. Configuración de Entornos en Angular

Se han añadido archivos de entorno en la aplicación Angular:

- **`environment.ts`** (Desarrollo)
  - Configurado para apuntar a la API en localhost
  - URL: `http://localhost:8000/api`

- **`environment.prod.ts`** (Producción)
  - Configurado con un marcador de posición `API_URL`
  - Este marcador será reemplazado en tiempo de compilación con la URL real del backend

### 3. Actualización del Servicio de Películas

El servicio `MovieService` ha sido modificado para usar las variables de entorno:

- Se ha importado el archivo de entorno
- Se ha reemplazado la URL codificada con la variable de entorno: `private apiUrl = environment.apiUrl;`

### 4. Script de Construcción Mejorado

Se ha mejorado el script de construcción del frontend en `render.yaml`:

```yaml
buildCommand: |
  npm install
  sed -i "s|API_URL|https://$API_URL/api|g" src/environments/environment.prod.ts
  npm run build -- --configuration production
```

Este script:
1. Instala las dependencias
2. Reemplaza el marcador `API_URL` en el archivo de entorno
3. Compila la aplicación en modo producción

## Proceso de Despliegue

Para desplegar la aplicación en Render:

1. **Preparación del repositorio**:
   - Todo el código está configurado en un único repositorio Git
   - El archivo `render.yaml` está en la raíz

2. **Despliegue en Render**:
   - Accede al panel de Render
   - Selecciona "Blueprints" → "New Blueprint Instance"
   - Conecta con el repositorio de GitHub
   - Render detectará automáticamente el archivo `render.yaml`
   - Configura cualquier variable de entorno adicional si es necesario
   - Inicia el despliegue

3. **Después del despliegue**:
   - El backend estará disponible en `https://catalogo-api.onrender.com`
   - El frontend estará disponible en `https://catalogo-frontend.onrender.com`
   - La aplicación frontend se conectará automáticamente al backend correcto

## Consideraciones

- El despliegue inicial puede tardar varios minutos
- Las bases de datos en el plan gratuito de Render pueden pausarse después de periodos de inactividad
- Para producción real, considera usar planes de pago para mejor rendimiento

---

**Nota**: Esta configuración está optimizada para el despliegue en Render.com. Si deseas desplegar en otra plataforma, podrían ser necesarios ajustes adicionales.
