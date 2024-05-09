const express = require('express');
const app = express();
const port = 4000;  
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
const cors = require('cors');
app.use(cors());

app.use(express.static('views'));  

app.get('/', (req, res) => {
  res.render("cors_attack");
});



app.listen(port, () => {
  console.log(`Attacker server running at http://localhost:${port}`);
});