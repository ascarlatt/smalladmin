<?php

declare(strict_types=1);

use SmallAdmin\Controllers\HomeController;
use SmallAdmin\Controllers\QueryController;
use SmallAdmin\Services\Router;

require __DIR__ . '/vendor/autoload.php';

(new Router())
    ->get('/', [HomeController::class, 'index'])
    ->get('/assets/*', [HomeController::class, 'asset'])
    ->get('/favicon.ico', [HomeController::class, 'asset'])
    ->post('/query', [QueryController::class, 'query'])
    ->get('/query', [QueryController::class, 'test'])
    ->dispatch();

