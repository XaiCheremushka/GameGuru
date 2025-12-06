<?php
class Database {
    private $host;
    private $port = "5432";
    private $db_name;
    private $username;
    private $password;
    public $conn;


    // Конструктор
    public function __construct() {
        $this->host = $_ENV['DB_HOST'];
        $this->port = $_ENV['DB_PORT'];
        $this->db_name = $_ENV['DB_NAME'];
        $this->username = $_ENV['DB_USER'];
        $this->password = $_ENV['DB_PASS'];
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
            dump("Connection DataBase error: {$exception->getMessage()}");
        }
        return $this->conn;
    }
}