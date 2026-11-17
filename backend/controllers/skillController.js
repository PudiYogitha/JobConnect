import Skill from '../models/Skill.js';

export async function listSkills(req, res) { res.json({ skills: await Skill.find().sort({ name: 1 }) }); }
