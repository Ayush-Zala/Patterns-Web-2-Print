<?php
namespace Patterns;

class Settings {
    public function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'init_settings']);
    }

    public function add_admin_menu() {
        add_menu_page(
            'Patterns Integration',
            'Patterns',
            'manage_options',
            'patterns-settings',
            [$this, 'render_settings_page'],
            'dashicons-cart'
        );
    }

    public function init_settings() {
        register_setting('patterns_settings_group', 'patterns_api_url');
        register_setting('patterns_settings_group', 'patterns_api_key');
        register_setting('patterns_settings_group', 'patterns_api_secret');

        add_settings_section(
            'patterns_main_section',
            'API Connection Details',
            null,
            'patterns-settings'
        );

        add_settings_field('patterns_api_url', 'API URL', [$this, 'render_input'], 'patterns-settings', 'patterns_main_section', ['name' => 'patterns_api_url']);
        add_settings_field('patterns_api_key', 'API Key', [$this, 'render_input'], 'patterns-settings', 'patterns_main_section', ['name' => 'patterns_api_key']);
        add_settings_field('patterns_api_secret', 'API Secret', [$this, 'render_password'], 'patterns-settings', 'patterns_main_section', ['name' => 'patterns_api_secret']);
    }

    public function render_input($args) {
        $name = $args['name'];
        $value = get_option($name);
        echo "<input type='text' name='$name' value='" . esc_attr($value) . "' class='regular-text' />";
    }

    public function render_password($args) {
        $name = $args['name'];
        $value = get_option($name);
        echo "<input type='password' name='$name' value='" . esc_attr($value) . "' class='regular-text' />";
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>Patterns Integration Settings</h1>
            <form method="post" action="options.php">
                <?php
                settings_fields('patterns_settings_group');
                do_settings_sections('patterns-settings');
                submit_button('Save Settings');
                ?>
            </form>
            
            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
                <input type="hidden" name="action" value="patterns_authenticate">
                <?php submit_button('Test Connection & Authenticate', 'secondary'); ?>
            </form>
            
            <?php
            $status = get_option('patterns_connection_status', 'DISCONNECTED');
            echo "<p><strong>Current Status:</strong> " . esc_html($status) . "</p>";
            ?>
        </div>
        <?php
    }
}
