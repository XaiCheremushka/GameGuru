<?php

namespace App\Models;

use PDO;
use PDOException;
use RuntimeException;

class Database {
    private $host = "postgres";
    private $port = "5432";
    private $db_name;
    private $username;
    private $password;
    public $conn;


    // Конструктор
    public function __construct() {
//        $this->host     = $_ENV['DATABASE_HOST'];
//        $this->port     = $_ENV['DATABASE_PORT'];
        $this->db_name  = $_ENV['DATABASE_NAME'];
        $this->username = $_ENV['DATABASE_USER'];
        $this->password = $_ENV['DATABASE_PASSWORD'];
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "pgsql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
        } catch(PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            throw new RuntimeException('Database connection failed');
        }
        return $this->conn;
    }
}