const pdfParse = require('pdf-parse');
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    const { selfDescription, jobDescription } = req.body;

    // Check if either resume file OR self description is provided
    if ((!req.file || !req.file.buffer) && (!selfDescription || selfDescription.trim() === "")) {
        return res.status(400).json({
            message: "Please provide either a resume file or a self description"
        });
    }

    let resumeContent = "";
    
    // Only parse PDF if a file was uploaded
    if (req.file && req.file.buffer) {
        try {
            const resumeData = await pdfParse(req.file.buffer);
            resumeContent = resumeData.text;
            console.log("PDF parsed successfully, length:", resumeContent.length);
        } catch (error) {
            console.error("PDF parsing error:", error);
            return res.status(400).json({
                message: "Error parsing PDF file. Please ensure it's a valid PDF.",
                error: error.message
            });
        }
    }

    try {
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription,
        });

        // FIXED: Extract title from job description or AI response
        let title = interViewReportByAi.title;
        if (!title || title.trim() === "") {
            // Try to extract title from job description (first line or common patterns)
            const lines = jobDescription.split('\n');
            title = lines[0].trim() || "Interview Report";
            // Limit title length
            if (title.length > 100) title = title.substring(0, 97) + "...";
        }

        // FIXED: Create report with explicit fields to ensure title is included
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent,
            selfDescription: selfDescription || "",
            jobDescription,
            title: title,
            matchScore: interViewReportByAi.matchScore || 0,
            technicalQuestions: interViewReportByAi.technicalQuestions || [],
            behavioralQuestions: interViewReportByAi.behavioralQuestions || [],
            skillGaps: interViewReportByAi.skillGaps || [],
            preparationPlan: interViewReportByAi.preparationPlan || [],
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport,
        });
    } catch (error) {
        console.error("Error generating interview report:", error);
        res.status(500).json({
            message: "Failed to generate interview report. Please try again.",
            error: error.message
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id,
    });

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found.",
        });
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport,
    });
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select(
            "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
        );

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports,
    });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found.",
        });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    try {
        const pdfBuffer = await generateResumePdf({
            resume,
            jobDescription,
            selfDescription,
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({
            message: "Failed to generate resume PDF. Please try again.",
            error: error.message
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
};