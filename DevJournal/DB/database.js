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
sql = "CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY, title, date, entry, msid)"

db.run(sql);

//Insert data into table
async function createPost(title, date, entry, msid) {

    let postId = await getPostId(title, date, entry, msid);

    //if post already exists
    if (postId != null) {

        return console.error("duplicate");

    }

    sql = `INSERT INTO entries(title, date, entry, msid) VALUES (?,?,?,?)`;
    
    db.run(sql, [title, date, entry, msid], (err) => {
        if (err) return null;
    });

    return (await getPostId(title, date, entry, msid));
}

//get data from id
//param: id
function getData(id) {

    let sql = "SELECT title, date, entry, msid FROM entries WHERE id = ?" 

    return new Promise((resolve,reject) => {

        db.get(sql,[id], (err,row) => {
            if (err) { 
                console.error(err.message);
                reject(err);
                return;
            }

            resolve(row ? { title: row.title, date: row.date, entry: row.entry, msid: row.msid } : null);

        });
    });
}


//returns rows in array format
//param: none
function getRows() {

    let sql = "SELECT * FROM entries";

    return new Promise((resolve,reject) => {

        let toReturn = [];

        db.all(sql, [], (err, rows) => {
            
            if (err) { 
            
                console.error(err.message);
                reject(err);
                return;
            }
            
            rows.forEach(row => toReturn.push(row));

            return resolve(toReturn);
        });

    });
}


//delete data from table
function deletePost(id) {

    sql = `DELETE FROM entries WHERE id = ?`;

    db.run(sql,[id],(err) => {

        if (err) return 1;
        else return 0; }
    );
}

//update data in existing table
//NOTE: need to add a way for other param to remain unchanged if only 1 or 2 of 3 param is affected
async function updatePost(id, title, date, entry, msid) {

    sql = "UPDATE entries SET title = ?, date = ?, entry = ?, msid = ? WHERE id = ?";

    db.run(sql,[title, date, entry, msid, id], (err) => {
        
        if (err) return 1;
        else return 0;
    });
}

//get post id based on title, date, entry
//returns id of the post that corresponds to this entry
function getPostId(title, date, entry, msid) {
    
    let sql = "SELECT id FROM entries WHERE title = ? AND date = ? AND entry = ? AND msid = ?";

    return new Promise((resolve, reject) => {
       
        db.get(sql, [title, date, entry, msid], (err, row) => {
           
            if (err) {
                
                console.error(err.message);
                reject(err);
                return;
            }

            resolve(row ? row.id : null);

        });
    });
}


//Developer usage ONLY
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
//db.run("DROP TABLE entries");

// --------------------------------------------------
                // Test Functions
// --------------------------------------------------

//createPost("Title1","date1","entry1");
//createPost("Title2","date1","entry1");
//createPost("Title3","date1","entry1");
//databaseContent();

id = createPost("Title4","date1","entry1");

id.then((value) => {
    console.log(value);
    // Expected output: "Success!"
  });


