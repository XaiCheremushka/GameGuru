<?php
$router = new \Bramus\Router\Router();

// Маршруты для аутентификации
//$router->post('/api/login', 'AuthController@login');
//$router->post('/api/register', 'AuthController@register');

// Защищенные маршруты
//$router->before('GET|POST|PUT|DELETE', '/api/.*', 'AuthMiddleware@authenticate');

// Маршруты для пользователей
//$router->get('/api/users', 'UserController@index');
//$router->get('/api/users/{id}', 'UserController@show');
//$router->post('/api/users', 'UserController@store');
//$router->put('/api/users/{id}', 'UserController@update');
//$router->delete('/api/users/{id}', 'UserController@destroy');

// Маршруты для категорий
$router->get('/api/v1/categories', 'CategoryController@index');
$router->get('/api/v1/categories/{id}', 'CategoryController@show');

// Маршруты для Жанров
$router->get('/api/v1/genres', 'GenreController@index');
$router->get('/api/v1/genres/{id}', 'GenreController@show');

// Маршруты для Разработчиков
$router->get('/api/v1/developers', 'DeveloperController@index');
$router->get('/api/v1/developers/{id}', 'DeveloperController@show');

// Маршруты для Игр
$router->get('/api/v1/games', 'GameController@index');
$router->get('/api/v1/games/{id}', 'GameController@show');

$router->run();