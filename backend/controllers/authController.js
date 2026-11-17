import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, qualification: user.qualification, experience: user.experience, skills: user.skills, resumeUrl: user.resumeUrl, companyName: user.companyName, companyDescription: user.companyDescription });

export async function register(req, res) {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !['seeker', 'recruiter'].includes(role)) return res.status(400).json({ message: 'Name, email, password and a valid role are required' });
    if (await User.exists({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with that email already exists' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role });
    res.status(201).json({ token: generateToken(user), user: publicUser(user) });
}

export async function login(req, res) {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+password');
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json({ token: generateToken(user), user: publicUser(user) });
}

export async function me(req, res) { res.json({ user: publicUser(await User.findById(req.user.id)) }); }
export { publicUser };
