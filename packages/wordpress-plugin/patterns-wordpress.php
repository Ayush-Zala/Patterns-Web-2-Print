<?php
/**
 * Plugin Name: Patterns Integration
 * Description: Connects WordPress to Patterns, acting as a presentation layer for products, categories, and assets.
 * Version: 1.0.0
 * Author: Patterns
 * Text Domain: patterns
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('PATTERNS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PATTERNS_PLUGIN_URL', plugin_dir_url(__FILE__));

// Autoload simple classes
spl_autoload_register(function ($class) {
    $prefix = 'Patterns\\';
    $base_dir = PATTERNS_PLUGIN_DIR . 'src/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Initialize plugin
add_action('plugins_loaded', function () {
    new \Patterns\Settings();
    new \Patterns\Auth();
    new \Patterns\Products();
    new \Patterns\Categories();
    new \Patterns\Assets();
});
