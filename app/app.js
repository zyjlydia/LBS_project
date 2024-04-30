const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route to display the HTML form
app.get('/', (req, res) => {
    res.render('index');
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const userInput = req.body.userInput;
    res.render('result', { userInput });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

