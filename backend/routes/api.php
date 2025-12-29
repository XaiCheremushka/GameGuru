<?php

$router = new \Bramus\Router\Router();

// Публичные маршруты (GET)
$router->get('/api/v1/categories/?', controller('CategoryController@index'));
$router->get('/api/v1/categories/(\d+)/?', controller('CategoryController@show'));

$router->get('/api/v1/genres/?', controller('GenreController@index'));
$router->get('/api/v1/genres/(\d+)/?', controller('GenreController@show'));

$router->get('/api/v1/developers/?', controller('DeveloperController@index'));
$router->get('/api/v1/developers/(\d+)/?', controller('DeveloperController@show'));

$router->get('/api/v1/games/?', controller('GameController@index'));
$router->get('/api/v1/games/(\d+)/?', controller('GameController@show'));

// Маршруты авторизации
$router->post('/api/v1/auth/login/?', controller('AuthController@login'));
$router->get('/api/v1/auth/verify/?', controller('AuthController@verify'));

// Добавляем маршруты для входа через Яндекс (OAuth)
$router->get('/api/v1/auth/yandex/redirect/?', controller('AuthController@yandexRedirect'));
$router->get('/api/v1/auth/yandex/callback/?', controller('AuthController@yandexCallback'));

// Защищенные маршруты (требуют авторизации)
// Категории
$router->post('/api/v1/admin/categories/?', controller('CategoryController@store'));
$router->put('/api/v1/admin/categories/(\d+)/?', controller('CategoryController@update'));
$router->delete('/api/v1/admin/categories/(\d+)/?', controller('CategoryController@destroy'));

// Жанры
$router->post('/api/v1/admin/genres/?', controller('GenreController@store'));
$router->put('/api/v1/admin/genres/(\d+)/?', controller('GenreController@update'));
$router->delete('/api/v1/admin/genres/(\d+)/?', controller('GenreController@destroy'));

// Разработчики
$router->post('/api/v1/admin/developers/?', controller('DeveloperController@store'));
$router->put('/api/v1/admin/developers/(\d+)/?', controller('DeveloperController@update'));
$router->delete('/api/v1/admin/developers/(\d+)/?', controller('DeveloperController@destroy'));

// Игры
$router->post('/api/v1/admin/games/?', controller('GameController@store'));
$router->put('/api/v1/admin/games/(\d+)/?', controller('GameController@update'));
$router->delete('/api/v1/admin/games/(\d+)/?', controller('GameController@destroy'));

// Загрузка файлов
$router->post('/api/v1/admin/upload/?', controller('UploadController@upload'));

$router->run();
