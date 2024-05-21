import express from "express";
import path from "path";

const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 3000;

//DATABASE SETUP ---------------------------
 import sqlite3 from 'sqlite3';
let sql;

//connect to DB
let db = new sqlite3.Database(__dirname + '/public/test.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the devjournal database.');
});

//possible additions include: tags
//create table BLANK
db.serialize(() =>{
    sql = "CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY, title, date, entry, msid)"
    db.run(sql);
});

//------------------------------------------


// Serve the index.html file
app.use(express.json());
app.use(express.static(__dirname + '/public'));



app.get('/', (req, res) => {
    res.sendFile('./public/index.html', { root: __dirname });
});

// app.get('/', (req, res) => {
//     app.use(express.static(path.join(__dirname, "public")));
// });

app.post("/all", async(req, res) => {
    let rows = await getRows();
    res.json(rows);
});

app.post('/delete', (req,res) =>{
    const id = req.body.id;
    console.log(req.body);
    deletePost(id);
    res.json({"complete":"yes"});
})

app.post('/update', (req,res) =>{
    const header = req.body.header;
    const time = req.body.time;
    const content = req.body.content;
    const msid = req.body.msid;
    const sqlid = req.body.sqlid;
    console.log(req.body);
    updatePost(header, time, content, msid, sqlid);
    res.json({"complete":"yes"});
})

app.post('/create', async (req,res) =>{
    const header = req.body.header;
    const time = req.body.time;
    const content = req.body.content;
    const msid = req.body.msid;
    console.log(req.body);
    let sqlid = await dbCreatePost(header, time, content, msid);
    console.log(sqlid);
    res.json({sqlid:sqlid});
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//DATABASE FUNCTIONS ----------------------------------
async function dbCreatePost(title, date, entry, msid) {
    let postId = await getPostId(title, date, entry, msid);

    //if post already exists
    if (postId != null) {
        return console.error("duplicate");
    }

    sql = `INSERT INTO entries(title, date, entry, msid) VALUES (?,?,?,?)`;
    db.run(sql, [title, date, entry, msid], (err) => {
        if (err) return console.error("error");
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
    console.log("entered getRows");
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




//delete data from table
//param: id
function deletePost(id) {
    sql = `DELETE FROM entries WHERE id = ?`;
    db.run(sql,[id],(err) => {
        if (err) return 1;
        else return 0; }
    );
}




//update data in existing table
//NOTE: need to add a way for other param to remain unchanged if only 1 or 2 of 3 param is affected
function updatePost(title, date, entry, msid, id) {
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