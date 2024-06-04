import express from "express";
import path from "path";

const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 3000;

//DATABASE SETUP ---------------------------
 import sqlite3 from 'sqlite3';
let sql;
//connect to DB, if it doesn't exist, create it
let db = new sqlite3.Database(__dirname + '/public/test.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the devjournal database.');
});

//create table if it doesn't exist
db.serialize(() => {
    sql = "CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY, title, date, entry, msid, tags)";
    db.run(sql);

    // Check if the table is empty
    sql = "SELECT COUNT(*) as count FROM entries";
    db.get(sql, [], (err, row) => {
        if (err) return console.error(err.message);
        if (row.count === 0) {
            // Insert a row with msid of 1 and tags of []
            sql = `INSERT INTO entries(title, date, entry, msid, tags) VALUES (?, ?, ?, ?, ?)`;
            db.run(sql, ['', '', '', 1, '[]'], (err) => {
                if (err) return console.error(err.message);
                console.log('Initialized table with a row.');
            });
        }
    });
});

//------------------------------------------


//Setup middleware and accept json input
app.use(express.json());
app.use(express.static(__dirname + '/public'));


//Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});

//POST request to get all elements in database
app.post("/all", async(req, res) => {
    let rows = await getRows();
    res.json(rows);
});

//POST request to get tags special row
app.post("/tags", async(req, res) => {
    let rows = await getTags();
    console.log('got tags', rows)
    res.json(rows);
});

//POST request to delete element
app.post('/delete', (req,res) =>{
    const id = req.body.id;
    //console.log(req.body);
    deletePost(id);
    res.json({"complete":"yes"});
})

//POST request to update element with new parameters
app.post('/update', (req,res) =>{
    const header = req.body.header;
    const time = req.body.time;
    const content = req.body.content;
    const msid = req.body.msid;
    const sqlid = req.body.sqlid;
    const tags = req.body.tags;
    //console.log(req.body);
    updatePost(header, time, content, msid, tags, sqlid); // Make sure this is right order
    res.json({"complete":"yes"});
})

//POST request to create new db element with parameters
app.post('/create', async (req,res) =>{
    const header = req.body.header;
    const time = req.body.time;
    const content = req.body.content;
    const msid = req.body.msid;
    const tags = req.body.tags;
    //console.log(req.body);
    let sqlid = await dbCreatePost(header, time, content, msid, tags);
    console.log(sqlid);
    res.json({sqlid:sqlid});
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//DATABASE FUNCTIONS ----------------------------------

/**
 * Creates a database entry with the parameters below.
 * @param {*} title 
 * @param {*} date 
 * @param {*} entry 
 * @param {*} msid 
 * @param {*} tags 
 * @returns integer primary key id of new entry.
 */
async function dbCreatePost(title, date, entry, msid, tags) {
    let postId = await getPostId(title, date, entry, msid, tags);

    //if post already exists
    if (postId != null) {
        return console.error("duplicate");
    }

    sql = `INSERT INTO entries(title, date, entry, msid, tags) VALUES (?,?,?,?,?)`;
    db.run(sql, [title, date, entry, msid, tags], (err) => {
        if (err) return console.error("error");
    });

    return (await getPostId(title, date, entry, msid, tags));
}


/**
 * Returns single entry given integer primary key id.
 * @param {*} id 
 * @returns entry
 */
function getData(id) {
    let sql = "SELECT title, date, entry, msid, tags FROM entries WHERE id = ?" 
    return new Promise((resolve,reject) => {
        db.get(sql,[id], (err,row) => {
            if (err) { 
                console.error(err.message);
                reject(err);
                return;
            }
            resolve(row ? { title: row.title, date: row.date, entry: row.entry, msid: row.msid, tags: row.tags } : null);
        });
    });
}


/**
 * Gets all database entries.
 * @returns all entries in the database, as an array of JSON objects.
 */
function getRows() {
    let sql = "SELECT * FROM entries WHERE msid != 1";
    //console.log("entered getRows");
    return new Promise((resolve,reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) { 
                console.error(err.message);
                reject(err);
            }
            resolve(rows)
        });
    });
}

/**
 * Gets tags from special row msid = 1.
 * @returns the tags row
 */
function getTags() {
    let sql = "SELECT * FROM entries WHERE msid == 1";
    //console.log("entered getRows");
    return new Promise((resolve,reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) { 
                console.error(err.message);
                reject(err);
            }
            resolve(rows)
        });
    });
}

/**
 * Deletes entry with provided id.
 * @param {*} id 
 */
function deletePost(id) {
    sql = `DELETE FROM entries WHERE id = ?`;
    db.run(sql,[id],(err) => {
        if (err) return 1;
        else return 0; }
    );
}


/**
 * Updates the existing entry with the provided id, such that it will contain the title, date, entry, and msid provided.
 * @param {*} title 
 * @param {*} date 
 * @param {*} entry 
 * @param {*} msid 
 * @param {*} tags
 * @param {*} id 
 */
function updatePost(title, date, entry, msid, tags, id) {
    sql = "UPDATE entries SET title = ?, date = ?, entry = ?, msid = ?, tags = ? WHERE id = ?";
    db.run(sql,[title, date, entry, msid, tags, id], (err) => {
        if (err) return 1;
        else return 0;
    });
}


/**
 * Gets integer primary key id of entry given its contents.
 * @param {*} title 
 * @param {*} date 
 * @param {*} entry 
 * @param {*} msid 
 * @param {*} tags
 * @returns id
 */
function getPostId(title, date, entry, msid, tags) {
    let sql = "SELECT id FROM entries WHERE title = ? AND date = ? AND entry = ? AND msid = ? AND tags = ?";
    return new Promise((resolve, reject) => {
        db.get(sql, [title, date, entry, msid, tags], (err, row) => {
            if (err) {
                console.error(err.message);
                reject(err);
                return;
            }
            resolve(row ? row.id : null);
        });
    });
}


/**
 * For debugging: prints out database table
 */
function databaseContent() {

    sql = `SELECT * FROM entries`;

    db.all(sql, [], (err, rows) => {

        if (err) return console.error(err.message);

            rows.forEach((row) => {

            console.log(row);
        });
    });
}