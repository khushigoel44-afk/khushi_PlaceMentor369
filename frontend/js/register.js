document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons();
  gsap.to("#register-card", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
});

const registerForm      = document.getElementById("registerForm");
const submitBtn         = document.getElementById("submitBtn");
const btnText           = document.getElementById("btnText");
const nameInput         = document.getElementById("name");
const emailInput        = document.getElementById("email");
const passwordInput     = document.getElementById("password");
const roleInput         = document.getElementById("role");
const togglePasswordBtn = document.getElementById("togglePassword");

// ── Helpers ──────────────────────────────────────────────────────────────────

function showError(field, customMsg) {
  field.classList.add("is-invalid");
  field.classList.remove("is-valid");
  const parent = field.closest("div");
  const inv = parent?.querySelector(".invalid-feedback");
  const val = parent?.querySelector(".valid-feedback");
  if (inv) { if (customMsg) inv.textContent = customMsg; inv.style.display = "block"; }
  if (val) val.style.display = "none";
  field.style.borderColor = "#ef4444";
  field.style.boxShadow   = "0 0 0 2px rgba(239,68,68,0.2)";
}

function showSuccess(field) {
  field.classList.remove("is-invalid");
  field.classList.add("is-valid");
  const parent = field.closest("div");
  const inv = parent?.querySelector(".invalid-feedback");
  const val = parent?.querySelector(".valid-feedback");
  if (inv) inv.style.display = "none";
  if (val) val.style.display = "block";
  field.style.borderColor = "#22c55e";
  field.style.boxShadow   = "0 0 0 2px rgba(34,197,94,0.2)";
}

// ── Per-field rules ───────────────────────────────────────────────────────────

function validateName(field) {
  if (!field.value.trim() || field.value.trim().length < 2) {
    showError(field, "Please enter your full name (at least 2 characters)."); return false;
  }
  showSuccess(field); return true;
}

function validateEmail(field) {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
  if (!field.value.trim() || !ok) { showError(field, "Please enter a valid email address."); return false; }
  showSuccess(field); return true;
}

function validatePassword(field) {
  if (field.value.length < 8) { showError(field, "Password must be at least 8 characters."); return false; }
  showSuccess(field); return true;
}

function validateRole(field) {
  if (!field.value) { showError(field, "Please select a role."); return false; }
  showSuccess(field); return true;
}

// ── Live validation ───────────────────────────────────────────────────────────

nameInput?.addEventListener("input",     () => validateName(nameInput));
emailInput?.addEventListener("input",    () => validateEmail(emailInput));
passwordInput?.addEventListener("input", () => validatePassword(passwordInput));
roleInput?.addEventListener("change",    () => validateRole(roleInput));

// ── Password toggle ───────────────────────────────────────────────────────────

togglePasswordBtn?.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  const icon = togglePasswordBtn.querySelector("[data-lucide]");
  if (icon) icon.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
  if (window.lucide) lucide.createIcons();
});

// ── Submit ────────────────────────────────────────────────────────────────────

registerForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameOk     = validateName(nameInput);
  const emailOk    = validateEmail(emailInput);
  const passwordOk = validatePassword(passwordInput);
  const roleOk     = validateRole(roleInput);
  if (!nameOk || !emailOk || !passwordOk || !roleOk) return;

  submitBtn.disabled = true;
  btnText.innerText  = "Creating Account...";

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:     nameInput.value.trim(),
        email:    emailInput.value.trim(),
        password: passwordInput.value,
        role:     roleInput.value.toLowerCase(),
      }),
    });

    const data = await res.json();
    if (!res.ok) { alert(data.message || "Registration failed"); return; }

    localStorage.setItem("placementor_session", JSON.stringify({ token: data.token, user: data.user }));

    if (data.user.role === "admin")          window.location.href = "admin/admin-dashboard.html";
    else if (data.user.role === "recruiter") window.location.href = "recruiter/recruiter-dashboard.html";
    else                                     window.location.href = "student/student-dashboard.html";

  } catch (err) {
    alert("Server error. Try again later.");
    console.error("Registration Error:", err);
  } finally {
    submitBtn.disabled = false;
    btnText.innerText  = "Create Account";
  }
});