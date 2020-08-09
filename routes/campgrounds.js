const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

router.get('/', function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user});	
		}
	});
});

// CREATE - add new campgound to DB
router.post('/', middleware.isLoggedIn, function(req, res){
	let name = req.body.name;
	let image = req.body.image;
	let desc = req.body.description;
	let price = req.body.price;
	const author = {
		id: req.user._id,
		username: req.user.username
	}
	let newCampground = {name: name, image: image, price: price, description: desc, author: author};
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
	});
});

//NEW - show form to create new campground/
router.get('/new', middleware.isLoggedIn, function(req, res){
	res.render('campgrounds/new')
});

//Show - shows more info about campground.
router.get('/:id', function(req, res){
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});
//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render('campgrounds/edit', {campground: foundCampground});		
	});
});

//UPDATE CAMPGROUND ROUTE

router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
	//find and update
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect('/campgrounds');
		} else {
			res.redirect('/campgrounds/' + req.params.id);
		}
	})
	//redirect
});

//DESTROY CAMPGROUND ROUTE

router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err,){
		if(err){
			res.redirect('back');
		} else {
			res.redirect('/campgrounds');
		}
	})
})




module.exports = router;