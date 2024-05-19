import express from "express";
import path from "path";

const __dirname = path.resolve();

const app = express();
const PORT = process.env.PORT || 3000;


// Serve the index.html file
// app.use(express.static(__dirname + 'public'));

app.get('/', (req, res) => {
    res.sendFile(path.join("C:/Users/maury/Desktop/Project/cse110-sp24-group34/views", "index.html"));
});

// app.get('/', (req, res) => {
//     app.use(express.static(path.join(__dirname, "public")));
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
