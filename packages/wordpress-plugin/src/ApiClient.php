<?php
namespace Patterns;

class ApiClient {
    public static function get($endpoint) {
        $url = rtrim(get_option('patterns_api_url'), '/');
        $token = Auth::get_token();

        if (!$url || !$token) {
            return new \WP_Error('patterns_error', 'Not connected to Patterns');
        }

        $response = wp_remote_get($url . '/api/v1' . $endpoint, [
            'headers' => [
                'Authorization' => 'Bearer ' . $token,
                'Content-Type' => 'application/json'
            ]
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        if ($code === 401) {
            // Need to re-authenticate (token expired)
            // For now, return error, user can click "Authenticate" again, or implement auto-refresh.
            return new \WP_Error('patterns_auth', 'Authentication token expired');
        }

        return json_decode(wp_remote_retrieve_body($response), true);
    }
}
