FROM node:16 as build

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Configurar API URL (se establece vía variables de entorno en Railway)
RUN if [ -f "src/environments/environment.prod.ts" ]; then \
    sed -i "s|API_URL|${API_URL:-http://localhost:8000/api}|g" src/environments/environment.prod.ts; \
    fi

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar la aplicación compilada
COPY --from=build /app/dist/catalogo-peliculas /usr/share/nginx/html

# Exponer puerto
EXPOSE ${PORT:-80}

# Configurar Nginx para usar el puerto asignado por Railway
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
