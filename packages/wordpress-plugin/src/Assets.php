<?php
namespace Patterns;

class Assets {
    public function __construct() {
        add_shortcode('patterns_assets', [$this, 'render_assets']);
    }

    public function render_assets($atts) {
        return '<p>Assets endpoint not yet implemented in API, but plugin is ready.</p>';
    }
}
