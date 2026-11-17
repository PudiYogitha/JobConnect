import Job from '../models/Job.js';
import Skill from '../models/Skill.js';
import JobSkill from '../models/JobSkill.js';

export async function listJobs(req, res) {
    const { title, location, skill, jobType, experience } = req.query;
    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (jobType) query.jobType = jobType;
    if (experience) query.experience = { $lte: Number(experience) };
    if (skill) {
        const matched = await Skill.find({ name: { $regex: skill, $options: 'i' } }).select('_id');
        query.skills = { $in: matched.map((item) => item._id) };
    }
    res.json({ jobs: await Job.find(query).populate('recruiter', 'name companyName').populate('skills', 'name').sort({ createdAt: -1 }) });
}

export async function createJob(req, res) {
    const { title, company, description, location, jobType, skills = [], experience, salaryMin, salaryMax } = req.body;
    if (!title?.trim() || !description?.trim() || !location?.trim()) return res.status(400).json({ message: 'Title, description and location are required' });
    const skillDocs = await Promise.all(skills.filter(Boolean).map((name) => Skill.findOneAndUpdate({ name: name.trim().toLowerCase() }, { name: name.trim().toLowerCase() }, { upsert: true, new: true })));
    const job = await Job.create({ recruiter: req.user.id, title, company, description, location, jobType, skills: skillDocs.map((item) => item._id), experience, salaryMin, salaryMax });
    await JobSkill.insertMany(skillDocs.map((skill) => ({ job: job._id, skill: skill._id })));
    res.status(201).json({ job: await job.populate('skills', 'name') });
}

export async function myJobs(req, res) { res.json({ jobs: await Job.find({ recruiter: req.user.id }).populate('skills', 'name').sort({ createdAt: -1 }) }); }
export async function getJob(req, res) {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name companyName').populate('skills', 'name');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ job });
}
