// app.js
const express = require('express');
const app = express();
const session = require('express-session');



app.use(session({
  secret: 'fwefjhi23awe34989wihvflwij',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false // 如果使用HTTPS，请设置为true
  }
}));


const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })).use(bodyParser.json());
const mysql = require('mysql');
const lodash = require('lodash');

const port = 3000;
const path = require('path');

const crypto = require('crypto');


const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4000',
  credentials: true 
}));

// set engines and static files
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'public'));
app.use(express.static('public'));

var connection = mysql. createConnection ( {
  host: 'localhost',
  user: 'demo', 
  password: 'password',
  database: 'webDemo'
});
module.exports = connection;



app.get('/', (req, res) => {
  console.log('main page');
  res.render('login');
});

// Log in pag
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  var hashed_password = crypto.createHash('sha1').update(password).digest('hex');
  connection.query('SELECT * FROM users WHERE username = ? AND passwd = ?', [username, hashed_password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).send('Internal Server Error');
      console.log('database');
      return;
    }
    if (results.length > 0) {
      console.log('login');
      req.session.username = username;
      req.session.password = password;
      //console.log('Session ID:', req.session.id);  
      //console.log(req.session.username);
      return res.redirect('/comment');
    } else {
      console.log('fail');
      res.redirect('/error');
    }
  });
});

// register
app.get('/register',(req, res) => {
  console.log('register get');
  res.render('register');
});

app.get('/comment', (req, res) => {
  res.render('comment');
  //console.log('Session ID:', req.session.id);  
  //console.log(req.session.username);
});


app.post('/register', (req, res) => {
  console.log('register post');
  const { username, password } = req.body;
  var hashed_password = crypto.createHash('sha1').update(password).digest('hex');
  connection.query('INSERT INTO users (username, passwd) VALUES (?, ?)', [username, hashed_password], (err, results) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.post('/submit-comment', (req, res) => {
  const { title, author, comment } = req.body;
  connection.query('INSERT INTO comments (title, author, data) VALUES (?, ?, ?)', [title, author, comment], (err, results) => {
    if (err) {
      console.error('Error inserting comment:', err);
      res.status(500).send('Error submitting comment');
      return;
    }
    res.redirect('/comment_table');
  });
});


app.get('/comment_table', (req, res) => {
  connection.query('SELECT * FROM comments', (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      res.status(500).send('Error fetching comments');
      return;
    }
    res.render('comment_table', { comments: results });
  });
});

app.get('/error', (req, res) => {
  console.log('error page');
  res.render('error');
});


app.get('/csrf-attack', (req, res) => {
  if (req.session.username) {
    res.render('csrf_attack', { username: req.session.username });
  } else {
    res.redirect('/login'); // 或 res.send('Unauthorized Access');
  }
});


app.get('/user-info',  (req, res) => {
  
  if (req.session.username) {
    res.json({ username: req.session.username, password: req.session.password });
    console.log("get in user-info");
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});


app.post('/prototype-pollution', (req, res) => {
  const userInput = req.body;
  const defaultObj = Object.create(null);

  console.log("Before merge:", defaultObj.isAdmin);  

  if (userInput.hasOwnProperty('__proto__')) {
    console.log("Prototype pollution detected! Attempting to pollute prototype...");
    Object.setPrototypeOf(defaultObj, userInput.__proto__);
  }

  console.log("After merge:", defaultObj.isAdmin);   


  if (defaultObj.isAdmin) {
    res.send('You are admin!');
  } else {
    res.send('You are not admin.');
  }
});

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const csrf = require('csurf');
const csrfProtection = csrf({
  cookie: {
    secure: false, 
    httpOnly: true, 
    sameSite: 'strict' 
  }
});

app.use(csrfProtection);




app.get('/change-password', csrfProtection, (req, res) => {
  res.render('change_passwd', { csrfToken: req.csrfToken() });
});

// 更改密码的路由
app.post('/change-password', csrfProtection, (req, res) => {
  console.log('change password');
  const { username, newPassword } = req.body;
  var hashed_password = crypto.createHash('sha1').update(newPassword).digest('hex');

  connection.query('UPDATE users SET passwd = ? WHERE username = ?', [hashed_password, username], (err, results) => {
    if (err) {
      console.error('Error updating password:', err);
      res.status(500).send('Failed to update password');
      return;
    }
    res.send('Password updated successfully');
  });
  console.log('Received username:', username);
  console.log('Received newPassword:', newPassword);
});


// start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
