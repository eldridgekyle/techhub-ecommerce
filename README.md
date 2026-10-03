# TechHub E-commerce Store

A responsive PHP, HTML, CSS, and JavaScript storefront for a fictional Philippine electronics store.

## Run locally

Install PHP, open a terminal in this project folder, and run:

```sh
php -S localhost:8000
```

Then visit <http://localhost:8000>.

## Customize

- Product names, specifications, and prices: `$products` in `index.php`
- Layout, colors, and responsive breakpoints: `styles.css`
- Cart, search, sorting, and filtering: `app.js`

The cart is saved in the browser's `localStorage`. Product photos load from Unsplash.

## Deploy

The included `Dockerfile` runs the site with PHP and Apache on a Docker-capable host.
