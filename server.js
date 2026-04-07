const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();

app.listen(3000);

app.use(express.urlencoded({ extended: true })); //ser till att reqbody fylls från formuläret
app.set('view engine', 'ejs');

// Databasanslutning
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Elvis6699!',
    database: 'cv'
});

db.connect(err => {
    if (err) console.error(err);
    else console.log('Ansluten');
});

// hem sidan
app.get('/', (req, res) => {
    db.query('SELECT * FROM courses ORDER BY id DESC', (err, courses) => {
        if (err) throw err;
        res.render('index', { courses });
    });
});

// add sidan
app.get('/add', (req, res) => {
    res.render('add');
});

// Lägg till kurs med post
app.post('/add', (req, res) => { //körs när man klickar spara kurs
    const { coursecode, coursename, syllabus, progression } = req.body; //datan användaren skrev i formuläret 

    const sql = 'INSERT INTO courses (coursecode, coursename, syllabus, progression) VALUES (?, ?, ?, ?)';//? är placeholders

    db.query(sql, [coursecode, coursename, syllabus, progression], (err) => { //skapar ny rad i courses
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

// Radera kurs
app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM courses WHERE id = ?', [id], (err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/');
    });
});

// Om
app.get('/about', (req, res) => {
    res.render('about');
});