import { api, requireRole, showToast, money } from './api.js';
requireRole('recruiter');
const page = document.body.dataset.page;
if (page === 'post-job') document.querySelector('[data-job-form]')?.addEventListener('submit', async (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); data.skills = data.skills.split(',').map((s) => s.trim()).filter(Boolean); data.experience = Number(data.experience); data.salaryMin = Number(data.salaryMin) || undefined; data.salaryMax = Number(data.salaryMax) || undefined; try { await api('/jobs', { method: 'POST', body: JSON.stringify(data) }); showToast('Job published'); event.target.reset(); } catch (error) { showToast(error.message); } });
if (page === 'my-jobs') api('/jobs/mine').then(({ jobs }) => { document.querySelector('[data-jobs]').innerHTML = jobs.length ? jobs.map((job) => `<article class="panel job-card"><div class="company">${job.company}</div><h3>${job.title}</h3><div class="meta"><span>${job.location}</span><span>${job.jobType}</span><b>${money(job.salaryMin)} - ${money(job.salaryMax)}</b></div><div class="chips">${job.skills.map((skill) => `<span class="chip">${skill.name}</span>`).join('')}</div></article>`).join('') : '<div class="empty">Post your first role to see it here.</div>'; }).catch((error) => showToast(error.message));
if (page === 'applicants') api('/applications/received').then(({ applications }) => { document.querySelector('[data-applicants]').innerHTML = applications.length ? applications.map((item) => `<tr><td><b>${item.applicant.name}</b><br><span class="muted">${item.applicant.email}</span></td><td>${item.job.title}</td><td>${item.applicant.experience || 0} yrs</td><td><select class="status-select" data-status="${item._id}"><option ${item.status === 'Applied' ? 'selected' : ''}>Applied</option><option ${item.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option><option ${item.status === 'Rejected' ? 'selected' : ''}>Rejected</option></select></td></tr>`).join('') : '<tr><td colspan="4" class="empty">No applicants yet.</td></tr>'; document.querySelectorAll('[data-status]').forEach((select) => select.addEventListener('change', async () => { try { await api(`/applications/${select.dataset.status}/status`, { method: 'PATCH', body: JSON.stringify({ status: select.value }) }); showToast('Application status updated'); } catch (error) { showToast(error.message); } })); }).catch((error) => showToast(error.message));
const profileForm = document.querySelector('[data-company-profile]');
if (profileForm) {
	api('/auth/me').then(({ user: profile }) => {
		localStorage.setItem('jobconnect_user', JSON.stringify(profile));
		profileForm.elements.namedItem('companyName').value = profile.companyName || '';
		profileForm.elements.namedItem('companyDescription').value = profile.companyDescription || '';
	}).catch((error) => showToast(error.message));
	profileForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		try {
			const { user: profile } = await api('/users/profile', { method: 'PUT', body: JSON.stringify(Object.fromEntries(new FormData(profileForm))) });
			localStorage.setItem('jobconnect_user', JSON.stringify(profile));
			profileForm.elements.namedItem('companyName').value = profile.companyName || '';
			profileForm.elements.namedItem('companyDescription').value = profile.companyDescription || '';
			showToast('Company profile saved');
		} catch (error) {
			showToast(error.message);
		}
	});
}
