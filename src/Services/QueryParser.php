<?php

namespace SmallAdmin\Services;

/**
 * A utility class for parsing SQL strings into individual queries.
 */
class QueryParser
{
    /**
     * Parses a SQL string into an array of individual queries.
     *
     * @param string $sql The SQL string to be parsed. Can include multiple queries separated by semicolons.
     * @return array An array of parsed SQL queries.
     */
    public static function parse(string $sql): array
    {
        $sql = trim($sql);
        if (empty($sql)) {
            return [];
        }

        $len = strlen($sql);
        $queries = [];
        $query = '';
        $i = 0;
        do {
            $query .= $sql[$i];

            if ($sql[$i] == ';') {
                $query = trim($query);
                if ($query != ';') {
                    $queries[] = $query;
                }
                $query = '';
            } elseif (($sql[$i] == '"' || $sql[$i] == "'" || $sql[$i] == '`') && $sql[$i - 1] != '\\') {
                $j = $i;
                do {
                    $j++;
                    $query .= $sql[$j];
                } while (($sql[$j] != $sql[$i] || $sql[$j - 1] == '\\' && $sql[$j - 2] != '\\') && $j < $len - 1);
                $i = $j;
            } elseif ($sql[$i] == '/' && $sql[$i + 1] == '*' && $sql[$i + 2] != '!' && $sql[$i + 2] != '+') {
                $j = $i;
                do {
                    $j++;
                    $query .= $sql[$j];
                } while ($sql[$j - 1] != '*' && $sql[$j] != '/' && $j < $len - 1);
                $i = $j;
            } elseif ($sql[$i] == '-' && $sql[$i + 1] == '-' && ($sql[$i + 2] == ' ' || $sql [$i + 2] == "\t") || $sql[$i] == '#') {
                $j = $i;
                do {
                    $j++;
                    $query .= $sql[$j];
                } while ($sql[$j] != "\r" && $sql[$j] != "\n" && $j < $len - 1);
                $i = $j;
            }

            $i++;
        } while ($i < $len);
        $query = trim($query);
        if (!empty($query) && $query != ';') {
            $queries[] = $query;
        }
        return $queries;
    }
}
