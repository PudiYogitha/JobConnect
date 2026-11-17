import { api, saveSession, showToast } from './api.js';
const form = document.querySelector('form[data-auth]');
form?.addEventListener('submit', async (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(form)); try { const result = await api(form.dataset.auth === 'register' ? '/auth/register' : '/auth/login', { method: 'POST', body: JSON.stringify(data) }); saveSession(result); window.location.href = result.user.role === 'seeker' ? 'seeker/dashboard.html' : 'recruiter/dashboard.html'; } catch (error) { showToast(error.message); } });
