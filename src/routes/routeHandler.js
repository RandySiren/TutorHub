const express = require('express');

const router = new express.Router();
const auth = require('../config/passport');

const userController = require('../controllers/user');
const homeController = require('../controllers/home');

/**
 * Login Routing
 */
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);

/**
 * Signup Routing
 */
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);

// Post Logged in Routing (everything beyond this point needs to be authenticated)

/**
 * Homepage Routing
 */
router.get('/', auth.isAuthenticated, homeController.getHome);

module.exports = router;
