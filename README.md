# manga-reader
Attempt of making manga reading website. The site uses React on client side (with Typescript) and Express framework on server side and postgres as DBMS.

# Starting project
1. To init local test database do ```cd db && sudo ./initDb.sh```
2. Create .env file in ```api``` directory with these variables declared:

DB_HOST=host of your database, usually ```localhost```

DB_PORT=port on which your database is running, usually ```5432```

DATABASE=```manga_reader```

DB_USER=```postgres```

DB_PASSWORD=your password for database

SECRET_KEY=your secret key to create and verify jwt-tokens

MAIL_HOST=host of your mail, usually gmail, for sending registration and password change e-mails

MAIL_PORT=port of your mail

EMAIL=your mail box address

EMAIL_PASSWD=your mail box password

3. ```npm i``` in both ```client``` and ```api``` directories and ```npm start``` im main directory
