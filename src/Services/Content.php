<?php

namespace SmallAdmin\Services;

class Content
{
    public const FOUND = 200;
    public const NOT_AUTHORIZED = 401;
    public const NOT_ALLOWED = 403;
    public const NOT_FOUND = 404;
    public const INTERNAL_SERVER_ERROR = 500;
    private static int $status = 200;
    private static array $headers = [
        'Content-Type' => 'application/json'
    ];

    public static function status(int $status): void
    {
        self::$status = $status;
    }

    /**
     * Add a header to the ouotput
     *
     * @param string $name
     * @param string $value
     * @return void
     */
    public static function header(string $name, string $value): void
    {
        self::$headers[$name] = $value;
    }

    /**
     * Shorthand for the Content-Type header
     *
     * @param string $contentType
     * @return void
     */
    public static function contentType(string $contentType): void
    {
        self::header('Content-Type', $contentType);
    }

    /**
     * Display the content and exits
     *
     * @param int $status
     * @param string $message
     * @return void
     */
    public static function abort(int $status, string $message): void
    {
        self::render(['error' => $message], $status);
        exit;
    }

    /**
     * Outputs the provided content with the specified HTTP status code and appropriate headers.
     *
     * @param mixed $content The content to output. Can be a string, array, or object.
     *                       Arrays and objects will be JSON-encoded.
     * @param int|null $status The HTTP status code to set in the response header. Default is 200.
     *
     * @return void
     */
    public static function render(mixed $content, ?int $status = null): void
    {
        if ($status !== null) {
            self::$status = $status;
        }

        if (self::$status == self::NOT_FOUND) {
            header('HTTP/1.1 404 Not Found');
        } elseif (self::$status == self::NOT_AUTHORIZED) {
            header('HTTP/1.1 401 Unauthorized');
        } elseif (self::$status == self::INTERNAL_SERVER_ERROR) {
            header('HTTP/1.1 500 Internal Server Error');
        } else {
            header('HTTP/1.1 200 OK');
        }

        if (self::$headers['Content-Type'] == 'application/json' && (is_string($content) || is_numeric($content))) {
            self::contentType('text/html');
        }

        foreach (self::$headers as $name => $value) {
            header($name . ': ' . $value);
        }

        if (is_array($content) || is_object($content)) {
            echo json_encode($content, JSON_PRETTY_PRINT);
        } else {
            echo $content;
        }
    }
}