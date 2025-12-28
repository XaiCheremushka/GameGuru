<?php

namespace App\Core;

use Exception;

class Dispatcher
{
    public static function dispatch(string $handler, array $params = []): void
    {
        // CategoryController@index
        if (!str_contains($handler, '@')) {
            throw new Exception("Invalid handler format: {$handler}");
        }

        [$controller, $method] = explode('@', $handler);

        $controllerClass = "App\\Controllers\\{$controller}";

        if (!class_exists($controllerClass)) {
            throw new Exception("Controller not found: {$controllerClass}");
        }

        $instance = new $controllerClass();

        if (!method_exists($instance, $method)) {
            throw new Exception("Method {$method} not found in {$controllerClass}");
        }

        call_user_func_array([$instance, $method], $params);
    }
}
