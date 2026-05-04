/* ============================================================
   WEBTION LAB — Quote Form Controller
   quote.js — Form validation, chip selection, email sending
   ============================================================ */

'use strict';

const QuoteForm = {
  selectedService: '',
  TARGET_EMAIL: 'Ravi.shanka.lawaniya@gmail.com',

  init() {
    this.bindChips();
    this.bindCharCount();
    this.bindSubmit();
  },

  /* ── CHIP SELECTION ── */
  bindChips() {
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('sel'));
        chip.classList.add('sel');
        this.selectedService = chip.dataset.service;
        document.getElementById('f-service').value = this.selectedService;
        document.getElementById('fg-service').classList.remove('err');
      });
    });
  },

  /* ── CHARACTER COUNT ── */
  bindCharCount() {
    const textarea = document.getElementById('f-desc');
    if (!textarea) return;
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      const counter = document.getElementById('charCount');
      if (counter) counter.textContent = len + ' / 30 characters minimum';
    });
  },

  /* ── VALIDATION ── */
  validate() {
    const fields = {
      name:     { el: 'f-name',     check: v => v.trim().length >= 2 },
      email:    { el: 'f-email',    check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      phone:    { el: 'f-phone',    check: v => /^[0-9]{10}$/.test(v.trim()) },
      service:  { el: 'f-service',  check: v => v.trim().length > 0 },
      budget:   { el: 'f-budget',   check: v => v.trim().length > 0 },
      timeline: { el: 'f-timeline', check: v => v.trim().length > 0 },
      desc:     { el: 'f-desc',     check: v => v.trim().length >= 30 },
    };

    let valid = true;
    for (const [key, config] of Object.entries(fields)) {
      const el     = document.getElementById(config.el);
      const fgEl   = document.getElementById('fg-' + key);
      const passed = el && config.check(el.value);
      if (fgEl) fgEl.classList.toggle('err', !passed);
      if (!passed) valid = false;
    }
    return valid;
  },

  /* ── COLLECT DATA ── */
  getData() {
    return {
      name:        document.getElementById('f-name')?.value.trim()     || '',
      email:       document.getElementById('f-email')?.value.trim()    || '',
      phone:       document.getElementById('f-phone')?.value.trim()    || '',
      company:     document.getElementById('f-company')?.value.trim()  || 'N/A',
      service:     this.selectedService,
      budget:      document.getElementById('f-budget')?.value.trim()   || '',
      timeline:    document.getElementById('f-timeline')?.value.trim() || '',
      description: document.getElementById('f-desc')?.value.trim()     || '',
      referral:    document.getElementById('f-referral')?.value.trim() || 'N/A',
    };
  },

  /* ── SUBMIT ── */
  bindSubmit() {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;
    btn.addEventListener('click', () => this.submit());
  },

  async submit() {
    if (!this.validate()) return;

    const btn = document.getElementById('submitBtn');
    btn.disabled     = true;
    btn.textContent  = '⏳ Sending your request...';

    const data = this.getData();

    /* PRIMARY: FormSubmit.co — sends email to Ravi.shanka.lawaniya@gmail.com */
    try {
      const fd = new FormData();
      fd.append('name',        data.name);
      fd.append('email',       data.email);
      fd.append('phone',       data.phone);
      fd.append('company',     data.company);
      fd.append('service',     data.service);
      fd.append('budget',      data.budget);
      fd.append('timeline',    data.timeline);
      fd.append('description', data.description);
      fd.append('referral',    data.referral);
      fd.append('_subject',    `New Quote Request from ${data.name} – ${data.service}`);
      fd.append('_captcha',    'false');
      fd.append('_template',   'table');
      fd.append('_next',       window.location.href);

      await fetch(`https://formsubmit.co/ajax/${this.TARGET_EMAIL}`, {
        method: 'POST', body: fd,
      });

    } catch (err) {
      /* FALLBACK: mailto link */
      const subject = encodeURIComponent(`New Quote Request from ${data.name} – ${data.service}`);
      const body    = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\n` +
        `Company: ${data.company}\nService: ${data.service}\n` +
        `Budget: ${data.budget}\nTimeline: ${data.timeline}\n` +
        `Referral: ${data.referral}\n\nProject Description:\n${data.description}`
      );
      window.open(`mailto:${this.TARGET_EMAIL}?subject=${subject}&body=${body}`, '_blank');
    }

    this.showSuccess(data);
  },

  /* ── SHOW SUCCESS ── */
  showSuccess(data) {
    const ssTable = document.getElementById('ss-table');
    if (ssTable) {
      ssTable.innerHTML = `
        <div class="ss-row"><span>Name</span><strong>${data.name}</strong></div>
        <div class="ss-row"><span>Email</span><strong>${data.email}</strong></div>
        <div class="ss-row"><span>Phone</span><strong>${data.phone}</strong></div>
        <div class="ss-row"><span>Service</span><strong>${data.service}</strong></div>
        <div class="ss-row"><span>Budget</span><strong>${data.budget}</strong></div>
        <div class="ss-row"><span>Timeline</span><strong>${data.timeline}</strong></div>
      `;
    }
    document.getElementById('quoteFormContent').style.display = 'none';
    document.getElementById('successBox').classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /* ── RESET ── */
  reset() {
    document.querySelectorAll('#quoteFormContent input, #quoteFormContent select, #quoteFormContent textarea')
      .forEach(el => el.value = '');
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('sel'));
    document.querySelectorAll('.fg').forEach(f => f.classList.remove('err'));
    this.selectedService = '';
    const counter = document.getElementById('charCount');
    if (counter) counter.textContent = '0 / 30 characters minimum';
    const btn = document.getElementById('submitBtn');
    if (btn) { btn.disabled = false; btn.textContent = '🚀 Send My Quote Request'; }
    document.getElementById('quoteFormContent').style.display = 'block';
    document.getElementById('successBox').classList.remove('show');
  }
};

document.addEventListener('DOMContentLoaded', () => QuoteForm.init());
