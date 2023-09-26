const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const validator = require('validator');
const exphbs = require('express-handlebars');

const app = express();

// Connecting to MongoDB
mongoose.connect('mongodb://localhost/3000', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Configure Express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Handlebars setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Load User model
const User = require('./models/User');

// Routes
app.get('/', (req, res) => {
  // for Rendering a form for user registration
  res.render('registration');
});


app.post('/save', (req, res) => {
  const { firstName, lastName, email, country, state, city, gender, dateOfBirth } = req.body;

  const newUser = new User({
    firstName,
    lastName,
    email,
    country,
    state,
    city,
    gender,
    dateOfBirth,
  });

  newUser
    .save()
    .then(() => {
      res.redirect('/users');
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error saving user');
    });
});

app.get('/users', (req, res) => {
  // Retrieve and display user information
  User.find()
    .then((users) => {
      res.render('userList', { users });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).send('Error fetching users');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
