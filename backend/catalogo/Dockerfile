FROM php:8.1-fpm

# Configurar directorio de trabajo
WORKDIR /var/www/html

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    nginx

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar todo el código de la aplicación
COPY . .

# Crear un composer.json vacío si no existe
RUN if [ ! -f "composer.json" ]; then echo '{"require": {}}' > composer.json; fi

# Instalar dependencias de PHP
RUN composer install --ignore-platform-reqs --no-scripts || true

# Configurar permisos de almacenamiento
RUN chmod -R 777 storage bootstrap/cache || true

# Crear un archivo .env a partir del .env.example
RUN if [ -f ".env.example" ]; then cp .env.example .env; fi

# Generar clave de aplicación si no existe
RUN php artisan key:generate --force || true

# Exponer puerto asignado por Railway
EXPOSE ${PORT:-8000}

# Crear un script de inicio
RUN echo '#!/bin/bash\n\
php artisan config:clear\n\
php artisan route:clear\n\
php artisan view:clear\n\
php artisan cache:clear\n\
php artisan migrate --force || true\n\
php -S 0.0.0.0:${PORT:-8000} -t public\n\
' > /start.sh && chmod +x /start.sh

# Ejecutar el script de inicio
CMD ["/start.sh"]
