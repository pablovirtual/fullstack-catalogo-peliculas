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

# Copiar código de la aplicación
COPY . .

# Instalar dependencias de PHP
RUN composer install --optimize-autoloader

# Configurar permisos de almacenamiento
RUN chmod -R 777 storage bootstrap/cache

# Exponer puerto asignado por Railway
EXPOSE ${PORT:-8000}

# Comandos de inicio (incluidos directamente en vez de usar un script externo)
CMD bash -c 'if [ -z "$APP_KEY" ]; then php artisan key:generate; fi && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}'
