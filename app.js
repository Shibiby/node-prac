const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash    = require('connect-flash');


const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'mysecret',
  resave: true,
  saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash());

require('./src/config/passport.js')(passport);

app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/popper.js/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [
  { link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }];

require('./src/routes/authRoutes')(app, passport); 

// const authRouter = require('./src/routes/authRoutes');

// app.use('/auth', authRouter());


// app.get('/', function (req, res) {
//   if (req.user) {
//       res.render('index.ejs', {});
//   } else {
//       res.render('login.ejs', {});
//   }
// });

app.get('/', (req, res) => {
  res.render('index', {
    nav: [{ link: '/books', title: 'Books' },
      { link: '/authors', title: 'Authors' }],
    title: 'Library'
  });
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
