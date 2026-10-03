# Serve TechHub with PHP and Apache on a PHP-capable host.
FROM php:8.3-apache

COPY . /var/www/html/

EXPOSE 80
