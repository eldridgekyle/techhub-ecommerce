<?php
// Product names, descriptions and prices are maintained in this PHP array.
$products = [
    [
        'id' => 'desktop-pc', 'name' => 'Desktop PC', 'category' => 'Desktop PCs',
        'specs' => 'Core i5 / 16GB RAM / 1TB SSD', 'price' => 42995, 'oldPrice' => 46995,
        'badge' => 'STUDENT PICK', 'photo' => 'photo-1587202372634-32705e3bf49c',
    ],
    [
        'id' => 'gaming-laptop', 'name' => 'Gaming Laptop', 'category' => 'Gaming',
        'specs' => 'Ryzen 7 / 16GB RAM / 512GB SSD / RTX graphics', 'price' => 65745, 'oldPrice' => 72995,
        'badge' => 'BESTSELLER', 'photo' => 'photo-1593642702821-c8da6771f0c6',
    ],
    [
        'id' => 'student-laptop', 'name' => 'Student Laptop', 'category' => 'Laptops',
        'specs' => 'Core i5 / 8GB RAM / 512GB SSD', 'price' => 32995, 'oldPrice' => 35995,
        'badge' => 'GREAT VALUE', 'photo' => 'photo-1496181133206-80ce9b88a853',
    ],
    [
        'id' => 'gaming-desktop', 'name' => 'Gaming Desktop', 'category' => 'Gaming',
        'specs' => 'Ryzen 5 / 16GB RAM / RTX 4060', 'price' => 58995, 'oldPrice' => null,
        'badge' => 'READY TO PLAY', 'photo' => 'photo-1587202372775-e229f172b9d7',
    ],
    [
        'id' => 'monitor', 'name' => '27” IPS Monitor', 'category' => 'Accessories',
        'specs' => '27” QHD / 165Hz / 1ms response', 'price' => 14995, 'oldPrice' => 16995,
        'badge' => 'SMOOTH STUDY', 'photo' => 'photo-1527443224154-c4a3942d3acf',
    ],
    [
        'id' => 'keyboard', 'name' => 'Mechanical Keyboard', 'category' => 'Accessories',
        'specs' => 'Hot-swap / RGB / TKL layout', 'price' => 4295, 'oldPrice' => null,
        'badge' => 'FAN FAVORITE', 'photo' => 'photo-1595225476474-87563907a212',
    ],
    [
        'id' => 'gaming-mouse', 'name' => 'Gaming Mouse', 'category' => 'Accessories',
        'specs' => '26K DPI / 6 programmable buttons', 'price' => 2495, 'oldPrice' => 2995,
        'badge' => 'LIGHTNING FAST', 'photo' => 'photo-1527814050087-3793815479db',
    ],
    [
        'id' => 'headset', 'name' => 'Headset', 'category' => 'Accessories',
        'specs' => '7.1 surround / noise-canceling mic', 'price' => 5995, 'oldPrice' => null,
        'badge' => 'STUDY MODE', 'photo' => 'photo-1505740420928-5e560c06d30e',
    ],
];

$templatePath = __DIR__ . '/index.template.html';
$template = file_get_contents($templatePath);
$productJson = json_encode(
    $products,
    JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
);

if ($template === false || $productJson === false) {
    http_response_code(500);
    exit('TechHub could not load its page template or product catalog.');
}

$productScript = '<script>window.TECHHUB_PRODUCTS = ' . $productJson . ';</script>';
echo str_replace('<!-- TECHHUB_PRODUCT_DATA -->', $productScript, $template);
