import Application from '../models/Application.js';
import Job from '../models/Job.js';

export async function apply(req, res) {
    if (!await Job.exists({ _id: req.body.jobId })) return res.status(404).json({ message: 'Job not found' });
    try { res.status(201).json({ application: await Application.create({ job: req.body.jobId, applicant: req.user.id }) }); }
    catch (error) {
        if (error.code === 11000) {
            const existing = await Application.exists({ job: req.body.jobId, applicant: req.user.id });
            if (existing) return res.status(409).json({ message: 'You have already applied for this job' });
            const keyPattern = error.keyPattern || {};
            const keyFields = Object.keys(keyPattern);
            const outdatedIndex = keyFields.length === 1 && ['job', 'applicant'].includes(keyFields[0]) ||
                keyFields.length === 2 && keyPattern.jobId === 1 && keyPattern.applicantId === 1;
            if (outdatedIndex) {
                return res.status(500).json({ message: 'The application database index is outdated. Restart the backend to repair it.' });
            }
        }
        throw error;
    }
}
export async function myApplications(req, res) { res.json({ applications: await Application.find({ applicant: req.user.id }).populate({ path: 'job', populate: { path: 'skills', select: 'name' } }).sort({ appliedDate: -1 }) }); }
export async function receivedApplications(req, res) {
    const jobs = await Job.find({ recruiter: req.user.id }).select('_id');
    res.json({ applications: await Application.find({ job: { $in: jobs.map((job) => job._id) } }).populate('applicant', 'name email phone qualification experience skills resumeUrl').populate('job', 'title company').sort({ appliedDate: -1 }) });
}
export async function updateStatus(req, res) {
    if (!['Applied', 'Shortlisted', 'Rejected'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid application status' });
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (String(application.job.recruiter) !== req.user.id) return res.status(403).json({ message: 'You do not own this job' });
    application.status = req.body.status; await application.save(); res.json({ application });
}
