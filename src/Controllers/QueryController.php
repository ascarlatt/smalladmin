<?php

declare(strict_types=1);

namespace SmallAdmin\Controllers;

use SmallAdmin\Services\QueryParser;

class QueryController extends Controller
{

    /**
     * Executes a database query using the input provided in the POST request.
     *
     * @return array The result of the database query.
     */
    public function query(): array
    {
        if (!empty($_POST['db'])) {
            $this->db->database($_POST['db']);
        }
        return $this->db->query($_POST['query']);
    }

    /**
     * Executes multiple database queries parsed from the input provided in the POST request.
     *
     * @return array An array containing the results of each executed database query.
     */
    public function multiQuery(): array
    {
        if (!empty($_POST['db'])) {
            $this->db->database($_POST['db']);
        }
        $result = [];
        foreach (QueryParser::parse($_POST['query']) as $query) {
            $result[] = $this->db->query($query);
        }
        return $result;
    }
}
