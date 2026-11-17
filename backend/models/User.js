import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['seeker', 'recruiter'], required: true },
  phone: String,
  qualification: String,
  experience: { type: Number, default: 0 },
  skills: [String],
  resumeUrl: String,
  companyName: String,
  companyDescription: String
}, { timestamps: true });

export default mongoose.model('User', userSchema);
