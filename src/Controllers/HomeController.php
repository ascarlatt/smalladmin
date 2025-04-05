<?php

namespace SmallAdmin\Controllers;

use SmallAdmin\Services\Content;

class HomeController extends Controller
{
    protected bool $connectToDb = false;

    /**
     * Retrieves an array that will be transformed into a JSON string
     *
     * @return string The home location string.
     */
    public function index(): string
    {
        return $this->asset('/home.html');
    }

    /**
     * Retrieves the content of the specified asset file if it exists.
     *
     * @param string $uri The URI of the asset file to be retrieved.
     * @return string|null The content of the asset file if it exists, or null if the file does not exist.
     */
    public function asset(string $uri): ?string
    {
        switch(strrchr($uri, '.')){
            case '.css': Content::contentType('text/css'); break;
            case '.js': Content::contentType('application/javascript'); break;
            case '.woff':
            case '.woff2': Content::contentType('application/font-woff2'); break;
            case '.html': Content::contentType('text/html'); break;
        }

        if(file_exists(__DIR__ . '/../../public' . $uri)) {
            return file_get_contents(__DIR__ . '/../../public' . $uri);
        }
        Content::status(Content::NOT_FOUND);
        return 'The asset file does not exist';
    }
}