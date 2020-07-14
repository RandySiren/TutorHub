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
router.get('/api/courses/:id', courseController.getCourseById);
router.post('/api/courses/add', courseController.postCourse);
router.post('/api/courses/add/:id', courseController.addCourseUser);

/**
 * User Routing
 */
router.get('/api/users', userController.getUsers);
router.get('/api/users/:id', userController.getUserById);
router.get('/api/users/:id/courses', userController.getUserCourses);
router.get('/users/me', userController.getCurrentUserData);

module.exports = router;
