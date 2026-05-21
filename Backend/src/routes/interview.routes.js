const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const uploadWithErrorHandling = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description Generate new interview report
 * @access Private
 */
interviewRouter.post(
    "/",
    authMiddleware.authUser,
    uploadWithErrorHandling("resume"),
    interviewController.generateInterViewReportController
)

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by ID
 * @access Private
 */
interviewRouter.get(
    "/report/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportByIdController
)

/**
 * @route GET /api/interview/
 * @description Get all interview reports for logged-in user
 * @access Private
 */
interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
)

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description Generate and download resume PDF
 * @access Private
 */
interviewRouter.post(
    "/resume/pdf/:interviewReportId",
    authMiddleware.authUser,
    interviewController.generateResumePdfController
)

module.exports = interviewRouter