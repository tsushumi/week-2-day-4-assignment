(function () {
  const form = document.getElementById("signup-form");
  const submitBtn = document.getElementById("submit-btn");
  const statusEl = document.getElementById("form-status");

  const validators = {
    name(value) {
      const trimmed = value.trim();
      if (trimmed.length < 2) {
        return { valid: false, message: "Name must be at least 2 characters" };
      }
      return { valid: true };
    },

    email(value) {
      const atIndex = value.indexOf("@");
      if (atIndex === -1) {
        return { valid: false, message: "Email must contain an @" };
      }
      const afterAt = value.slice(atIndex + 1);
      const dotIndex = afterAt.indexOf(".");
      // Needs a dot after the @, with a domain segment on each side of it,
      // and something before the @ too.
      if (atIndex === 0 || dotIndex <= 0 || dotIndex === afterAt.length - 1) {
        return { valid: false, message: "Email must contain @ and a . after it" };
      }
      return { valid: true };
    },

    phone(value) {
      const digitsOnly = /^\d+$/.test(value);
      if (!digitsOnly || value.length !== 10) {
        return { valid: false, message: "Phone must be 10 digits starting with 07 or 01" };
      }
      if (!/^(07|01)/.test(value)) {
        return { valid: false, message: "Phone must be 10 digits starting with 07 or 01" };
      }
      return { valid: true };
    },

    password(value) {
      if (value.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters" };
      }
      if (!/[A-Z]/.test(value)) {
        return { valid: false, message: "Password needs at least 1 uppercase letter" };
      }
      if (!/\d/.test(value)) {
        return { valid: false, message: "Password needs at least 1 number" };
      }
      return { valid: true };
    },
  };

  const fieldState = { name: false, email: false, phone: false, password: false };

  function validateField(fieldName) {
    const wrapper = form.querySelector(`[data-field="${fieldName}"]`);
    const input = wrapper.querySelector("input");
    const messageEl = wrapper.querySelector(".field-message");
    const result = validators[fieldName](input.value);

    fieldState[fieldName] = result.valid;

    wrapper.classList.remove("is-valid", "is-invalid");
    if (input.value.length === 0) {
      // Untouched / cleared: neutral state, no red flash.
      messageEl.textContent = "";
    } else if (result.valid) {
      wrapper.classList.add("is-valid");
    } else {
      wrapper.classList.add("is-invalid");
      messageEl.textContent = result.message;
    }

    updateSubmitState();
  }

  function updateSubmitState() {
    const allValid = Object.values(fieldState).every(Boolean);
    submitBtn.disabled = !allValid;
  }

  Object.keys(validators).forEach((fieldName) => {
    const input = document.getElementById(fieldName);
    input.addEventListener("input", () => validateField(fieldName));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Guard: re-validate everything on submit in case of programmatic changes.
    Object.keys(validators).forEach(validateField);
    if (!Object.values(fieldState).every(Boolean)) return;

    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      password: document.getElementById("password").value,
    };

    console.log("Signup form submitted:", formData);

    statusEl.classList.add("is-visible");
    window.setTimeout(() => statusEl.classList.remove("is-visible"), 4000);

    form.reset();
    Object.keys(fieldState).forEach((key) => (fieldState[key] = false));
    form.querySelectorAll(".form-field").forEach((wrapper) => {
      wrapper.classList.remove("is-valid", "is-invalid");
      wrapper.querySelector(".field-message").textContent = "";
    });
    updateSubmitState();
  });
})();
