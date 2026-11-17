import { api, requireRole, showToast, money } from './api.js';
requireRole('seeker');
const page = document.body.dataset.page;
const jobsEl = document.querySelector('[data-jobs]');
const jobCard = (job, includeViewButton = true) => `<article class="panel job-card"><div><div class="company">${job.company}</div><h3>${job.title}</h3></div><div class="meta"><span>${job.location}</span><span>${job.jobType}</span><span>${job.experience}+ yrs</span></div><div class="chips">${(job.skills || []).map((skill) => `<span class="chip">${skill.name}</span>`).join('')}</div><div class="meta"><b>${money(job.salaryMin)} - ${money(job.salaryMax)}</b></div>${includeViewButton ? `<a class="btn btn-primary" href="job-details.html?id=${job._id}">View role</a>` : ''}</article>`;
async function loadJobs() { if (!jobsEl) return; const params = new URLSearchParams(new FormData(document.querySelector('[data-search]') || document.createElement('form'))); jobsEl.innerHTML = '<div class="empty">Loading roles...</div>'; try { const { jobs } = await api(`/jobs?${params}`); jobsEl.innerHTML = jobs.length ? jobs.map((job) => jobCard(job)).join('') : '<div class="empty">No roles match your search.</div>'; } catch (error) { jobsEl.innerHTML = `<div class="empty">${error.message}</div>`; } }
if (page === 'jobs') { loadJobs(); document.querySelector('[data-search]')?.addEventListener('submit', (event) => { event.preventDefault(); loadJobs(); }); }
if (page === 'details') {
    const applyButton = document.querySelector('[data-apply]');
    applyButton.disabled = true;
    (async () => {
        const job = (await api(`/jobs/${new URLSearchParams(location.search).get('id')}`)).job;
        document.querySelector('[data-job]').innerHTML = jobCard(job, false);
        applyButton.disabled = false;
        applyButton.onclick = async () => {
            applyButton.disabled = true;
            try {
                await api('/applications', { method: 'POST', body: JSON.stringify({ jobId: job._id }) });
                applyButton.textContent = 'Applied';
                showToast('Application sent successfully');
            } catch (error) {
                applyButton.disabled = false;
                showToast(error.message);
            }
        };
    })().catch((error) => showToast(error.message));
}
if (page === 'applications') {
    const applicationsEl = document.querySelector('[data-applications]');
    applicationsEl.innerHTML = '<tr><td colspan="3" class="empty">Loading applications...</td></tr>';
    api('/applications/mine').then(({ applications }) => {
        applicationsEl.innerHTML = applications.length
            ? applications.map(({ job, status, appliedDate }) => `<tr><td><b>${job?.title || 'Job no longer available'}</b><br><span class="muted">${job?.company || ''}</span></td><td>${new Date(appliedDate).toLocaleDateString()}</td><td><span class="status ${status}">${status}</span></td></tr>`).join('')
            : '<tr><td colspan="3" class="empty">No applications yet.</td></tr>';
    }).catch((error) => {
        applicationsEl.innerHTML = '<tr><td colspan="3" class="empty">Could not load applications. Please try again.</td></tr>';
        showToast(error.message);
    });
}
const profileForm = document.querySelector('[data-profile]');
function fillProfile(form, profile) {
    for (const [name, value] of Object.entries(profile)) {
        const field = form.elements.namedItem(name);
        if (field) field.value = name === 'skills' ? (value || []).join(', ') : value ?? '';
    }
}
if (profileForm) {
    api('/auth/me').then(({ user: profile }) => {
        localStorage.setItem('jobconnect_user', JSON.stringify(profile));
        fillProfile(profileForm, profile);
    }).catch((error) => showToast(error.message));
    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(profileForm));
        data.experience = Number(data.experience || 0);
        data.skills = data.skills?.split(',').map((skill) => skill.trim()).filter(Boolean);
        try {
            const { user: profile } = await api('/users/profile', { method: 'PUT', body: JSON.stringify(data) });
            localStorage.setItem('jobconnect_user', JSON.stringify(profile));
            fillProfile(profileForm, profile);
            showToast('Profile saved');
        } catch (error) {
            showToast(error.message);
        }
    });
}
