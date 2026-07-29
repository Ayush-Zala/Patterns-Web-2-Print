<?php
namespace Patterns;

class Categories {
    public function __construct() {
        add_shortcode('patterns_categories', [$this, 'render_categories']);
    }

    public function render_categories($atts) {
        return '<p>Categories endpoint not yet implemented in API, but plugin is ready.</p>';
    }
}
