<?php

declare(strict_types=1);

namespace SmallAdmin\Controllers;

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
}
