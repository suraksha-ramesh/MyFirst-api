var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./Model/product');
var WishList = require('./Model/wishList');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product/', function(req, res){
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.likes = 0;
    //or var product = new Product(res.body);
    product.save(function(err, savedObject){
        if(err){
            res.status(500).send({error: "Could not save product"})
        } else {
            res.status(200).send(savedObject);
        }
    });
});

app.get('/product/', function(req, res){
    //This is asynchronous. later statements may be executed before find
   Product.find({}, function(err, products){
       if(err){
           res.status(500).send({error: "Could not fetch data!"});
       } else {
           res.status(200).send(products);
       }
   });
});

app.get('/wishlist', function(req, res){
   WishList.find({}).populate({path: 'products', model: 'Product'}).exec(function(err, wishlists){
       if(err){
           res.status(500).send({error: "Could not fetch data!"});
       } else {
           res.status(200).send(wishlists);
       }
   });
});

app.post('/wishlist', function(req, res){
    var wl = new WishList();
    wl.title = req.body.title;
    
    wl.save(function(err, savedObject){
        if(err){
            res.status(500).send({error: "Could not create wish list"});
        } else {
            res.status(200).send(savedObject);
        }
    });
});

app.put('/wishlist/product/add', function(req, res){
   Product.findOne({_id: req.body.productId}, function(err, product){
       if(err){
           res.status(500).send({error: "Could not add item to wishlist"});
       } else {
           WishList.update({_id: req.body.wishListId}, {$addToSet:{products: product._id}}, function(err, wishList){
               if(err){
                   res.status(500).send({error: "Could not add item to wishlist"});
               } else {
                   res.send(wishList);
               }
           });
       }
   });
});

app.listen(8080, function() {
    console.log("Swag shop API running on port 8080"); 
});

var cors = require('cors');

app.use(cors()); // Use this after the variable declaration