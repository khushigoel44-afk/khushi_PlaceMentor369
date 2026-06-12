// login.js
// -------------------------
// Initialize Lucide & GSAP
// -------------------------
lucide.createIcons();
gsap.to("#login-card", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });

// -------------------------
// Elements
// -------------------------
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const passwordToggleBtn = document.getElementById("togglePassword");
const btnText = document.getElementById("btnText");
const passwordField = document.getElementById("password");

// -------------------------
// Password Toggle
// -------------------------
passwordToggleBtn.addEventListener("click", () => {
  const isPassword = passwordField.type === "password";
  passwordField.type = isPassword ? "text" : "password";
  const eyeIcon = passwordToggleBtn.querySelector("[data-lucide]");
  if (eyeIcon) {
    eyeIcon.setAttribute("data-lucide", isPassword ? "eye-off" : "eye");
  }
  lucide.createIcons();
});

// -------------------------
// Login Form Submit
// -------------------------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!loginForm.checkValidity()) {
    return; // validation.js will handle UI
  }

  const email = document.getElementById("email")?.value;
  const password = passwordField?.value;
  const role = document.getElementById("role")?.value;

  if (!email || !password || !role) {
    return showToast("Please fill all fields!", "error");
  }

  loginBtn.disabled = true;
  btnText.innerText = "Authenticating...";

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Login failed", "error");
      return;
    }

    localStorage.setItem(
      "placementor_session",
      JSON.stringify({ token: data.token, user: data.user })
    );

    showToast("🎉 Signed in successfully!", "success");
    setTimeout(() => {
      if (data.user.role === "admin") {
        window.location.href = "admin/admin-dashboard.html";
      } else if (data.user.role === "recruiter") {
        window.location.href = "recruiter/recruiter-dashboard.html";
      } else {
        window.location.href = "student/student-dashboard.html";
      }
    }, 1500);

  } catch (err) {
    console.error("Login Error:", err);
    showToast("Server error. Try again later.", "error");
  } finally {
    loginBtn.disabled = false;
    btnText.innerText = "Sign In";
  }
});

// ============================
// PREMIUM TOAST SYSTEM
// ============================
function showToast(message, type = "success") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full px-4 md:px-0";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    const isSuccess = type === "success";
    
    toast.className = `flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 transform translate-x-full opacity-0 ${
        isSuccess 
        ? "bg-white/95 border-emerald-100 shadow-emerald-100/50" 
        : "bg-white/95 border-rose-100 shadow-rose-100/50"
    }`;
    
    const successIcon = `<svg class="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    const errorIcon = `<svg class="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    const closeIcon = `<svg class="w-4 h-4 text-slate-400 hover:text-slate-600 transition" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`;

    toast.innerHTML = `
        ${isSuccess ? successIcon : errorIcon}
        <div class="flex-1 text-sm font-semibold text-slate-800 leading-relaxed">${message}</div>
        <button class="flex-shrink-0 focus:outline-none ml-1">${closeIcon}</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove("translate-x-full", "opacity-0");
        toast.classList.add("translate-x-0", "opacity-100");
    }, 50);

    toast.querySelector("button").addEventListener("click", () => {
        closeToast(toast);
    });

    setTimeout(() => {
        closeToast(toast);
    }, 4000);
}

function closeToast(toast) {
    if (!toast.parentNode) return;
    toast.classList.remove("translate-x-0", "opacity-100");
    toast.classList.add("translate-x-full", "opacity-0");
    setTimeout(() => {
        toast.remove();
    }, 300);
}
