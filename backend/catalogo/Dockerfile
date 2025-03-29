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
RUN composer install --no-dev --optimize-autoloader

# Configurar permisos de almacenamiento
RUN chmod -R 777 storage bootstrap/cache

# Generar clave de aplicación
RUN php artisan key:generate

# Exponer puerto 8000
EXPOSE 8000

# Ejecutar el comando de inicio de la aplicación
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
