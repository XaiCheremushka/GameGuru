<?php

namespace App\Models;

use App\Models\Database;
use PDO;

class GameModel {
    private PDO $db;
    private string $tableName = "games";

    public function __construct() {
        $this->db = (new Database())->getConnection();
    }

    public function getAllGames() {
        $query = "SELECT * FROM " . $this->tableName;
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getGameById($id) {
        $query = "SELECT * FROM " . $this->tableName . " WHERE id = :id";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}