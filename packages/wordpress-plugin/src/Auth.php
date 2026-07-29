<?php
namespace Patterns;

class Auth {
    public function __construct() {
        add_action('admin_post_patterns_authenticate', [$this, 'authenticate']);
    }

    public function authenticate() {
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $url = rtrim(get_option('patterns_api_url'), '/');
        $key = get_option('patterns_api_key');
        $secret = get_option('patterns_api_secret');

        if (!$url || !$key || !$secret) {
            wp_die('Missing credentials. Please save settings first.');
        }

        $response = wp_remote_post($url . '/api/v1/storefront/auth', [
            'headers' => [
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode([
                'apiKey' => $key,
                'apiSecret' => $secret
            ])
        ]);

        if (is_wp_error($response)) {
            update_option('patterns_connection_status', 'ERROR: ' . $response->get_error_message());
            wp_redirect(admin_url('admin.php?page=patterns-settings'));
            exit;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body = json_decode(wp_remote_retrieve_body($response), true);

        if ($code >= 200 && $code < 300 && isset($body['data']['accessToken'])) {
            update_option('patterns_access_token', $body['data']['accessToken']);
            update_option('patterns_connection_status', 'CONNECTED');
        } else {
            update_option('patterns_connection_status', 'FAILED (' . $code . ')');
        }

        wp_redirect(admin_url('admin.php?page=patterns-settings'));
        exit;
    }

    public static function get_token() {
        // Implement token refresh logic here if needed.
        return get_option('patterns_access_token');
    }
}
