# smallAdmin

This is a web-based administration tool for MySQL and MariaDB servers. It uses
[Bootstrap](https://getbootstrap.com/) and a dark theme.

The aim is to be simpler than [phpMyAdmin](https://www.phpmyadmin.net/), more user
friendly than [Adminer](https://www.adminer.org/) and prettier than both.

As of now, it supports browsing databases, browsing tables and running queries.

Versions `0.*` should be treated as beta and are not to be relied upon.

# Security considerations

The authentication is done with the username and password of the MySQL/MariaDB
server. Additional security methods should be taken into consideration when
deploying on a public server. Like IP filtering, secure http connection, etc.

# Running in docker or docker-compose

Instructions to follow

# Running in a webserver

Download a release from [the release page](https://github.com/ascarlatt/smalladmin/releases)
and copy it in a folder on your webserver. Point you browser to `http://server.name/smalladmin`.

It would be better to actually create a different host (e.g. subdomain) and point the
server root of it to `smalladmin/public` folder, so that all the other folders are
not exposed directly.

## Running locally

1. Clone the project repository:
   ```bash
   git clone git@github.com:ascarlatt/smalladmin.git
   ```

2. Navigate to the project folder:
   ```bash
   cd smalladmin
   ```

3. Install dependencies via Composer:
   ```bash
   composer install
   ```

4. Serve the project locally:
   ```bash
   php -S localhost:8000 -t public
   ```

---

## TODO

There are big plans for the future. In no particular order:

* keep query history
* run multiple queries
* export tables (or even the whole database)
* import .sql files
* live demo
* syntax highlighting
* query autocomplete (including database, table and field names)
* write unit tests :)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes with clear messages.
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

---

## License

This project is released under MIT license.

---

## Acknowledgements

- [Bootstrap](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [PHPUnit](https://phpunit.de/)
