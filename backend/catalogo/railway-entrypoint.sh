#!/bin/bash

# Generar clave de aplicación si no existe
if [ -z "$APP_KEY" ]; then
  php artisan key:generate
fi

# Ejecutar migraciones de base de datos
php artisan migrate --force

# Iniciar el servidor en el puerto asignado por Railway
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
