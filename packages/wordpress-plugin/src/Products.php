<?php
namespace Patterns;

class Products {
    public function __construct() {
        add_shortcode('patterns_products', [$this, 'render_products']);
    }

    public function render_products($atts) {
        $response = ApiClient::get('/storefront/products');

        if (is_wp_error($response)) {
            return '<p>Error loading products: ' . esc_html($response->get_error_message()) . '</p>';
        }

        if (!isset($response['success']) || !$response['success']) {
            return '<p>Error loading products from Patterns API.</p>';
        }

        $products = $response['data'];

        if (empty($products)) {
            return '<p>No products found.</p>';
        }

        $html = '<div class="patterns-products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">';

        foreach ($products as $product) {
            $rawImageUrl = $product['imageUrl'];
            $imageUrl = 'https://placehold.co/400x300?text=No+Image';
            
            if (!empty($rawImageUrl)) {
                if (strpos($rawImageUrl, 'http') === 0) {
                    $imageUrl = esc_url($rawImageUrl);
                } else {
                    // For local development, point to the local MinIO storage
                    $imageUrl = esc_url('http://localhost:9000/patterns-public/' . ltrim($rawImageUrl, '/'));
                }
            }

            $price = number_format($product['price'] / 100, 2);

            $html .= '<div class="patterns-product-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">';
            $html .= '<img src="' . $imageUrl . '" alt="' . esc_attr($product['title']) . '" style="width: 100%; height: auto; border-radius: 4px; margin-bottom: 10px;" />';
            $html .= '<h3 style="margin: 0 0 10px 0;">' . esc_html($product['title']) . '</h3>';
            $html .= '<p style="color: #666; font-size: 0.9em; margin-bottom: 10px;">' . esc_html($product['description']) . '</p>';
            $html .= '<p style="font-weight: bold; font-size: 1.1em; margin: 0;">$' . esc_html($price) . '</p>';
            $html .= '</div>';
        }

        $html .= '</div>';

        return $html;
    }
}
