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
async function createPost(title, date, entry) {

    try {

        let postId = await getPostId(title, date, entry);

        console.log(postId);

        //if post already exists
        if (postId != null) {

            return console.log("Post already exists");
        }

        sql = `INSERT INTO entries(title, date, entry) VALUES (?,?,?)`;
        
        db.run(sql, [title, date, entry], (err) => {
            if (err) return console.error(err.message);
        });

    } catch (error) {

        console.error('Error fetching post ID:', error);
    }
}

//delete data from table
function deletePost(id) {

    sql = `DELETE FROM entries WHERE id = ?`;

    db.run(sql,[id],(err) => {

        if (err) return console.error(err.message); }
    );
}

//update data in existing table
//NOTE: need to add a way for other param to remain unchanged if only 1 or 2 of 3 param is affected
async function updatePost(id, title, date, entry) {

    sql = "UPDATE entries SET title = ?, date = ?, entry = ? WHERE id = ?";

    db.run(sql,[title,date,entry,id], (err) => {
        
        if (err) return console.error(err.message);

    });
}

//get post id based on title, date, entry
//returns id of the post that corresponds to this entry
//must be wrapped in try catch
function getPostId(title, date, entry) {
    
    let sql = "SELECT id FROM entries WHERE title = ? AND date = ? AND entry = ?";

    return new Promise((resolve, reject) => {
       
        db.get(sql, [title, date, entry], (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
                return;
            }

            resolve(row ? row.id : null);

        });
    });
}

//get data, must be wrapped in try catch
function getData(id) {
    
    let sql = "SELECT title, date, entry FROM entries WHERE id = ?" 

    return new Promise((resolve,reject) => {

        db.get(sql,[id], (err,row) => {
            if (err) { 
                console.error(err.message);
                reject(err);
                return;
            }

            resolve(row ? { title: row.title, date: row.date, entry: row.entry } : null);

        });
    });
}


//print out the table
//param: none
function databaseContent() {
    sql = `SELECT * FROM entries`;

    db.all(sql, [], (err, rows) => {
       
        if (err) return console.error(err.message);
            rows.forEach((row) => {
            console.log(row);
        });
    });
}


//Drop table - deletes table, i.e. database that stores data. ideally dont uncomment and run it unless you want to quick reset
// db.run("DROP TABLE entries");

// --------------------------------------------------
                // Test Functions
// --------------------------------------------------

// createPost("Title3","date1","entry1");
// tableContents();
