const express = require('express');

const router = new express.Router();
const auth = require('../config/passport');
const userController = require('../controllers/user');
const homeController = require('../controllers/home');
const courseController = require('../controllers/course');

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
// router.all('*', auth.isAuthenticated);
/**
 * Homepage Routing
 */
router.get('/', homeController.getHome);

/**
 * Course Routing
 */
router.get('/courses', courseController.getCoursesHome);
router.get('/courses/add', courseController.getCoursesAdd);
router.get('/courses/view', courseController.getCoursesView);
router.get('/api/courses', courseController.getCourses);
router.post('/api/courses/add', courseController.postCourse);

/**
 * User Routing
 */
router.get('/api/users', userController.getUsers);
router.get('/api/users/:id', userController.getUserById);

module.exports = router;
