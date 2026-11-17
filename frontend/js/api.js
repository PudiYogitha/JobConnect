const API_URL = 'http://localhost:5000/api';
export async function api(path, options = {}) {
    const token = localStorage.getItem('jobconnect_token');
    const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
}
export function saveSession(data) { localStorage.setItem('jobconnect_token', data.token); localStorage.setItem('jobconnect_user', JSON.stringify(data.user)); }
export function getUser() { try { return JSON.parse(localStorage.getItem('jobconnect_user')); } catch { return null; } }
export function requireRole(role) { const user = getUser(); if (!user || user.role !== role) window.location.href = '../login.html'; return user; }
export function logout() {
    localStorage.removeItem('jobconnect_token');
    localStorage.removeItem('jobconnect_user');
    window.location.href = '../index.html';
}
document.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-logout]') : null;
    if (target) {
        event.preventDefault();
        logout();
    }
});
export function showToast(message) { const toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = message; document.body.append(toast); setTimeout(() => toast.remove(), 3000); }
export function money(value) { return value ? `$${Number(value).toLocaleString()}` : 'Not disclosed'; }
