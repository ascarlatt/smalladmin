<?php

namespace SmallAdmin\Services;

use mysqli;
use mysqli_result;

class Db
{
    private mysqli $connection;

    /**
     * Constructor method to initialize a database connection using MySQLi.
     *
     * @param string $host The hostname or IP address of the database server.
     * @param string $user The username for the database connection.
     * @param string $password The password for the database connection.
     */
    public function __construct(string $host, string $user, string $password)
    {
        $this->connection = new mysqli($host, $user, $password);
    }

    /**
     * Returns the active connection
     *
     * @return mysqli
     */
    public function connection(): mysqli
    {
        return $this->connection;
    }

    /**
     * Selects the database to use for the current connection.
     *
     * @param string $database The name of the database to select.
     * @return self
     */
    public function database(string $database): self
    {
        $this->connection->select_db($database);
        return $this;
    }

    /**
     * Run a query and return the result properly parsed
     *
     * @param string $query
     * @return array
     */
    public function query(string $query): array
    {
        $start = microtime(true);
        try {
            $result = $this->connection->query($query);
        } catch (\mysqli_sql_exception $e) {
            return [
                'duration' => microtime(true) - $start,
                'query' => $query,
                'errno' => $this->connection->errno,
                'error' => $this->connection->error,
                'affected' => -1,
                'returned' => -1,
            ];
        }
        if ($result instanceof mysqli_result) {
            return [
                'duration' => microtime(true) - $start,
                'query' => $query,
                'columns' => array_map(fn($field) => $field->name, $result->fetch_fields()),
                'rows' => $result->fetch_all(MYSQLI_NUM),
                'info' => $this->connection->info,
                'affected' => -1,
                'returned' => $result->num_rows,
                'errno' => 0,
                'error' => '',
            ];
        }
        return [
            'duration' => microtime(true) - $start,
            'query' => $query,
            'info' => $this->connection->info,
            'affected' => $this->connection->affected_rows,
            'returned' => -1,
            'errno' => 0,
            'error' => '',
        ];
    }
}
