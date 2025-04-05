<?php

declare(strict_types=1);

namespace SmallAdmin\Services;

use SmallAdmin\Controllers\Controller;

class Router
{
    private array $routes = [];

    /**
     * Registers a new route with the specified HTTP method, route, and callback.
     *
     * @param string $method The HTTP method for the route (e.g., GET, POST).
     * @param string $route The route path to associate with the callback.
     * @param array|callable $callback The function to be executed when the route is accessed.
     * @return self Returns the current instance to allow method chaining.
     */
    public function register(string $method, string $route, array|callable $callback): self
    {
        if ($method == 'ALL' || $method == '*') {
            $method = 'GET|POST|PUT|PATCH|DELETE';
        }
        foreach (explode('|', $method) as $meth) {
            $this->routes[] = [
                'method' => $meth,
                'path' => $route,
                'callback' => $callback
            ];
        }
        return $this;
    }

    /**
     * Registers a GET route with the specified route and callback.
     *
     * @param string $route The URI pattern of the route to register.
     * @param array|callable $callback The callback function or method to handle the route.
     * @return self Returns the current instance for method chaining.
     */
    public function get(string $route, array|callable $callback): self
    {
        return $this->register('GET', $route, $callback);
    }

    /**
     * Registers a POST route with the specified route and callback.
     *
     * @param string $route The URI pattern of the route to register.
     * @param array|callable $callback The callback function or method to handle the route.
     * @return self Returns the current instance for method chaining.
     */
    public function post(string $route, array|callable $callback): self
    {
        return $this->register('POST', $route, $callback);
    }

    /**
     * Registers a PATCH route with the specified route and callback.
     *
     * @param string $route The URI pattern of the route to register.
     * @param array|callable $callback The callback function or method to handle the route.
     * @return self Returns the current instance for method chaining.
     */
    public function patch(string $route, array|callable $callback): self
    {
        return $this->register('PATCH', $route, $callback);
    }

    /**
     * Registers a PUT route with the specified route and callback.
     *
     * @param string $route The URI pattern of the route to register.
     * @param array|callable $callback The callback function or method to handle the route.
     * @return self Returns the current instance for method chaining.
     */
    public function put(string $route, array|callable $callback): self
    {
        return $this->register('PUT', $route, $callback);
    }

    /**
     * Registers a DELETE route with the specified route and callback.
     *
     * @param string $route The URI pattern of the route to register.
     * @param array|callable $callback The callback function or method to handle the route.
     * @return self Returns the current instance for method chaining.
     */
    public function delete(string $route, array|callable $callback): self
    {
        return $this->register('DELETE', $route, $callback);
    }

    /**
     * Returns the registered routes
     *
     * @return array
     */
    public function getRoutes(): array
    {
        return $this->routes;
    }

    /**
     * Find the route that matches a request
     *
     * @param string $method
     * @param string $uri
     * @return array|null
     */
    public function getRoute(string $method, string $uri): ?array
    {
        foreach ($this->routes as $route) {
            if ($route['method'] == $method && fnmatch($route['path'], $uri)) {
                return $route;
            }
        }
        return null;
    }

    /**
     * Handles the dispatching of a request based on the provided HTTP method and URI.
     * It will also output the result
     *
     * @param string|null $method The HTTP method of the request (e.g., GET, POST).
     * @param string|null $uri The URI of the request to be dispatched.
     * @return void
     */
    public function dispatch(?string $method = null, ?string $uri = null): void
    {
        if (!$method) {
            $method = $_SERVER['REQUEST_METHOD'];
        }
        if (!$uri) {
            $uri = $_SERVER['REQUEST_URI'];
            if (str_contains($uri, '?') !== false) {
                $uri = explode('?', $uri)[0];
            }
        }

        $route = $this->getRoute($method, $uri);

        if (!$route) {
            Content::render('Not found', Content::NOT_FOUND);
            return;
        }

        if (is_array($route['callback'])
            && !empty($route['callback'][0]) && class_exists($route['callback'][0])
            && is_subclass_of($route['callback'][0], Controller::class)
            && !empty($route['callback'][1]) && method_exists($route['callback'][0], $route['callback'][1])
        ) {
            $route['callback'][0] = new $route['callback'][0];
        }

        if (is_callable($route['callback'])) {
            $result = call_user_func($route['callback'], $uri);
            Content::render($result);
        } else {
            Content::render('Cannot call internal method', Content::INTERNAL_SERVER_ERROR);
        }
    }
}
