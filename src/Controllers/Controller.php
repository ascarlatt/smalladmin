<?php

declare(strict_types=1);

namespace SmallAdmin\Controllers;

use SmallAdmin\Services\Content;
use SmallAdmin\Services\Db;

abstract class Controller
{
    protected bool $connectToDb = true;
    protected Db $db;

    public function __construct()
    {
        if ($this->connectToDb) {
            if (empty($_POST['credentials']) || empty($_POST['credentials']['host']) || empty($_POST['credentials']['user']) || !isset($_POST['credentials']['pass'])) {
                Content::abort(Content::NOT_AUTHORIZED, 'Empty credentials');
            }
            try {
                $this->db = @new Db($_POST['credentials']['host'], $_POST['credentials']['user'], $_POST['credentials']['pass']);
            } catch (\mysqli_sql_exception $e) {
                Content::abort(Content::NOT_AUTHORIZED, $e->getMessage());
            }
        }
    }
}
