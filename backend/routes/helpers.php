<?php

use App\Core\Dispatcher;

function controller(string $handler): Closure
{
    return function (...$params) use ($handler) {
        Dispatcher::dispatch($handler, $params);
    };
}
