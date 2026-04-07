const express = require('express');
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
}); //ansluter till dbn

// hem sidan
app.get('/', (req, res) => {
    db.query('SELECT * FROM courses ORDER BY id DESC', (err, courses) => {
        if (err) throw err;
        res.render('index', { courses }); //kommer loopa igenom dessa i index.ejs för att skriv ut dom till ett formulär
    });
});

// add sidan
app.get('/add', (req, res) => {
    res.render('add');
});

// Lägg till kurs med post
app.post('/add', (req, res) => { //körs när man klickar spara kurs
    const { coursecode, coursename, syllabus, progression } = req.body; //datan användaren skrev i formuläret 

    const sql = 'INSERT INTO courses (coursecode, coursename, syllabus, progression) VALUES (?, ?, ?, ?)';//? är placeholders som sen fylls i med , [coursecode, coursename, syllabus, progression],

    db.query(sql, [coursecode, coursename, syllabus, progression], (err) => { //skapar ny rad i courses
        if (err) {
            console.error(err);
        }
        res.redirect('/'); //laddar om sidan
    });
});

// Radera kurs
app.get('/delete/:id', (req, res) => { //id är parametern i urlen, om vi vill ta bort 5e kursen kommer 5 skickas med
    const id = req.params.id;
    db.query('DELETE FROM courses WHERE id = ?', [id], (err) => { //? är här också en placeholder för idet, om id är 12 kommer databasen få DELETE FROM courses WHERE id = 12
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