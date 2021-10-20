const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

let noteInfo = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")))

app.get("/api/notes", function (err, res) {
    try {
        noteInfo = fs.readFileSync("./db/db.json", "utf-8")
        noteInfo = JSON.parse(noteInfo);
    } catch {
        console.log(err);
    }
    res.json(noteInfo);
});

app.post("/api/notes", function (req, res) {
    try {
        noteInfo = fs.readFileSync("./db/db.json", "utf-8")
        console.log(noteInfo);
        noteInfo = JSON.parse(noteInfo);
        req.body.id = noteInfo.length;
        noteInfo.push(req.body);
        noteInfo = JSON.stringify(noteInfo);
        fs.writeFile("./db/db.json", noteInfo, "utf-8", function (err) {
            if (err) {
                console.log(err);
            }
        });

        res.json(JSON.parse(noteInfo));
    } catch (err) {
        console.error(err);
    }
});

app.delete("/api/notes/:id", function (req, res) {
    try {
        noteInfo = fs.readFileSync("./db/db.json", "utf8");
        noteInfo = JSON.parse(noteInfo);
        noteInfo = noteInfo.filter(function (note) {
            return note.id != req.params.id;
        });
        noteInfo = JSON.stringify(noteInfo);
    
        fs.writeFile("./db/db.json", noteInfo, "utf8", function (err) {
            if (err) 
            throw err;
        });
    
        res.send(JSON.parse(noteInfo));
    } catch (err) {
        console.log(err);
    }
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.get("/api/notes", function (req, res) {
    return res.sendFile(path.json(__dirname, "./db/db.json"));
});


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);