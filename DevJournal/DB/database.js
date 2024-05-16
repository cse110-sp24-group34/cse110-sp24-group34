//issues to test: 
//1. does it get saved locally when refreshed
//...


const sqlite3 = require('sqlite3').verbose();
let sql;

//connect to DB
let db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the devjournal database.');
});

//possible additions include: tags
//create table BLANK
sql = "CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY, title, date, entry)"

db.run(sql);

//Insert data into table
function createPost(title, date, entry) {

    
    sql = `INSERT INTO entries(title, date, entry) VALUES (?,?,?)`;
    
    db.run(
        sql,
        ["second Post", "2021-01-01", "This is my second post"],
        (err) => {
            if (err) return console.error(err.message);
        }
    );
}

function deletePost(id) {

    sql = `DELETE FROM entries WHERE id = ?`;
    db.run(
        sql,
        [id],
        (err) => {
            if (err) return console.error(err.message);
        }
    );

}

//query the data
sql = `SELECT * FROM entries`;
db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);
    rows.forEach((row) => {
        console.log(row);
    });
});

//Drop table
//db.run("DROP TABLE entries");