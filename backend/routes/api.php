<?php

echo "api.php works";

$router = new \Bramus\Router\Router();

$router->get('/api/v1/categories/?', controller('CategoryController@index'));
$router->get('/api/v1/categories/(\d+)/?', controller('CategoryController@show'));

$router->get('/api/v1/genres/?', controller('GenreController@index'));
$router->get('/api/v1/genres/(\d+)/?', controller('GenreController@show'));

$router->get('/api/v1/developers/?', controller('DeveloperController@index'));
$router->get('/api/v1/developers/(\d+)/?', controller('DeveloperController@show'));

$router->get('/api/v1/games/?', controller('GameController@index'));
$router->get('/api/v1/games/(\d+)/?', controller('GameController@show'));

$router->run();

echo "api.php runs";
