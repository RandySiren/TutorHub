const express = require('express');

const router = new express.Router();
const auth = require('../config/passport');
const userController = require('../controllers/user');
const homeController = require('../controllers/home');
const courseController = require('../controllers/course');
const tutorController = require('../controllers/tutors');
const adminController = require('../controllers/admin');

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
router.all('/admin/*', auth.isAdmin);
router.all('/tutor/*', auth.isTutor);
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
router.post('/api/courses/remove/:id', courseController.removeCourseUser);

/**
 * User Routing
 */
router.get('/user/settings', userController.getSettingsPage);
router.get('/api/users', userController.getUsers);
router.get('/api/users/:id', userController.getUserById);
router.get('/api/users/:id/courses', userController.getUserCourses);
router.get('/api/users/:id/tutors', userController.getUserTutors);
router.get('/users/me', userController.getCurrentUserData);

/**
 * Tutor Routing
 */
router.get('/tutors/add', tutorController.getTutorsAdd);
router.post('/tutors/update', tutorController.updateAboutPage);
router.get('/tutors/view', tutorController.getTutorsView);
router.get('/tutors/view/:id', tutorController.getTutorsViewById);
router.get('/becomeatutor', tutorController.becomeATutor); // Change this to post later
router.get('/api/tutors', tutorController.getTutors);
router.get('/api/tutors/:id', tutorController.getTutorsById);
router.post('/api/tutors/add/:id', tutorController.addTutorUser);
router.post('/api/tutors/remove/:id', tutorController.removeTutorUser);
router.get('/api/tutors/course/:id', tutorController.getTutorsByCourse);

router.get('/tutor/panel', tutorController.getTutorsPanel);
/**
 * Admin Routing
 */
router.get('/admin/panel', adminController.getAdminHome);
router.get('/admin/tutorrequests', adminController.getTutorRequests);
router.delete('/admin/tutorrequests/accept/:id', adminController.acceptTutor);
router.delete('/admin/tutorrequests/deny/:id', adminController.denyTutor);

module.exports = router;
