const express        = require('express'),
	  mongoose       = require('mongoose'),
	  app            = express(),
	  PORT           = process.env.PORT || 3000,
      bodyParser     = require('body-parser'),
      Campground     = require('./models/campground'),
      seedDB         = require('./seeds'),
      Comment        = require('./models/comment'),
      passport       = require('passport'),
      LocalStrategy  = require('passport-local'),
      User           = require('./models/user'),
	  methodOverride = require('method-override'),
	  flash          = require('connect-flash'),
	  URL   	     = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';


//Requiring Routes
const commentRoutes    = require('./routes/comments'),
	  campgroundRoutes = require('./routes/campgrounds'),
	  indexRoutes      = require('./routes/index');

console.log(process.env.DATABASEURL);

//mongoose.connect(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => {
	console.log('Error', error.message);
});



app.use(flash());

//seedDB();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

//PASSPORT CONFIG
app.use(require('express-session')({
	secret: 'Kai is my lord',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(PORT, ()=> {
	console.log('Yelp Camp Server Has Started!');		   
});