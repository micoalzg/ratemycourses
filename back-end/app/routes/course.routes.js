const express = require('express');
const router = express.Router();

const course = require('../controllers/course.controller');
const authMiddleware = require('../../auth.middleware');

const courseRoute = '/api/courses'

router.post(courseRoute + '/save', course.addCourse);
router.get(courseRoute + '/getAllCourseCodes', course.getAllCourseCodes);
router.get(courseRoute + '/getCourseByCourseCode/:course_code', course.getCourseByCourseCode);
router.patch(courseRoute + '/modifyCourse/:course_code', authMiddleware, course.modifyCourse)

module.exports = router;

