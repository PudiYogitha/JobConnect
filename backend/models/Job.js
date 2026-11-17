import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote'], required: true },
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  experience: { type: Number, required: true, min: 0 },
  salaryMin: Number,
  salaryMax: Number
}, { timestamps: true });
export default mongoose.model('Job', jobSchema);
