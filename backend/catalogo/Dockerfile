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
    unzip

# Instalar extensiones PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar todo el código de la aplicación
COPY . .

# Configurar permisos
RUN chmod -R 777 storage bootstrap/cache || true

# Crear archivo .env si no existe
RUN if [ ! -f ".env" ] && [ -f ".env.example" ]; then cp .env.example .env; fi

# Instalar dependencias
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev || true

# Generar clave
RUN php artisan key:generate --force || true

# Exponer puerto
EXPOSE ${PORT:-8000}

# Comando de inicio directo
CMD php -S 0.0.0.0:${PORT:-8000} -t public
