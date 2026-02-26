/* ================================================
   ENSEMBLE — Form Handling
   ================================================ */

(function () {
  'use strict';

  const form = document.getElementById('signup-form');
  const submitBtn = document.getElementById('submit-btn');
  const msgEl = document.getElementById('form-message');

  if (!form) return;

  function setMessage(text, type) {
    msgEl.textContent = text;
    msgEl.className = 'form-message ' + type;
  }

  function clearMessage() {
    msgEl.textContent = '';
    msgEl.className = 'form-message';
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    clearMessage();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();

    // Basic validation
    if (!name) {
      setMessage('Please enter your name.', 'error');
      form.querySelector('#name').focus();
      return;
    }

    if (!email || !isValidEmail(email)) {
      setMessage('Please enter a valid email address.', 'error');
      form.querySelector('#email').focus();
      return;
    }

    // Submit state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Taking the stage\u2026';

    try {
      const data = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        setMessage(
          'You\u2019re on the list \u2014 the curtain rises soon. Check your inbox.',
          'success'
        );
        submitBtn.textContent = 'You\u2019re in the Company';
      } else {
        const json = await response.json().catch(() => ({}));
        const errText =
          json.errors
            ? json.errors.map((err) => err.message).join(', ')
            : 'Something went wrong. Please try again.';
        setMessage(errText, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reserve My Place';
      }
    } catch (_err) {
      setMessage('Unable to connect. Please check your connection and try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Reserve My Place';
    }
  });
})();
