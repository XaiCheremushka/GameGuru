<?php

namespace App\Models;

use App\Models\Database;
use PDO;

class AdminModel {
    private PDO $db;
    private string $tableName = "admins";

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    /**
     * Найти админа по email
     */
    public function findByEmail(string $email) {
        $query = "SELECT * FROM " . $this->tableName . " WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Найти админа по ID
     */
    public function findById(int $id) {
        $query = "SELECT id, email, name, created_at FROM " . $this->tableName . " WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Проверить пароль
     */
    public function verifyPassword(string $password, string $hash): bool {
        return password_verify($password, $hash);
    }
}

