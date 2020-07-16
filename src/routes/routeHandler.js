const express = require('express');

const router = new express.Router();
const auth = require('../config/passport');
const userController = require('../controllers/user');
const homeController = require('../controllers/home');
const courseController = require('../controllers/course');
const tutorController = require('../controllers/tutors');

/**
 * Login Routing
 */
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/logout', userController.getLogout);

/**
 * Signup Routing
 */
router.get('/signup', userController.getSignup);
router.post('/signup', userController.postSignup);

// Post Logged in Routing (everything beyond this point needs to be authenticated)
router.all('*', auth.isAuthenticated);
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

/**
 * Tutor Routing
 */
router.get('/tutors/add', tutorController.getTutorsAdd);
router.get('/tutors/view', tutorController.getTutorsView);
router.get('/becomeatutor', tutorController.postTutor); // Change this to post later
router.get('/api/tutors', tutorController.getTutors);
router.get('/api/tutors/:id', tutorController.getTutorsById);

module.exports = router;
