// ============================
// CONSTANTS & SESSION
// ============================
const API_BASE = "http://localhost:5000/api/student";
;
const SESSION_KEY = "placementor_session";

function getSession() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session || !session.token || session.user.role !== "student") return null;
    return session;
}

const session = getSession();
if (!session) {
    alert("Login required!");
    window.location.href = "../login.html";
}

const { token, user } = session;

// ============================
// PROFILE ELEMENTS
// ============================
const fullNameInput = document.getElementById("fullName");
const rollInput = document.getElementById("rollNumber");
const branchSelect = document.getElementById("branch");
const cgpaInput = document.getElementById("cgpa");

const skillsContainer = document.getElementById("skillsContainer");
const skillInput = document.getElementById("skillInput");
const skillLevelSelect = document.getElementById("skillLevel");

const resumeInput = document.getElementById("resumeInput");
const resumeActions = document.getElementById("resumeActions");
const resumeFileName = document.getElementById("resumeFileName");
const viewPdfBtn = document.getElementById("viewPdfBtn");
const removeResumeBtn = document.getElementById("removeResumeBtn");

const saveBtn = document.getElementById("saveBtn");
const completionBar = document.getElementById("completionBar");
const completionText = document.getElementById("completionText");
const completionMessage = document.getElementById("completionMessage");

// ============================
// STATE
// ============================
let skills = [];
let resumeBase64 = null;

// ============================
// UTILITY FUNCTIONS
// ============================
function updateCompletion() {
    const filled = [
        fullNameInput.value.trim(),
        rollInput.value.trim(),
        branchSelect.value,
        cgpaInput.value,
        skills.length > 0,
        resumeBase64
    ].filter(Boolean).length;

    const percent = Math.floor((filled / 6) * 100);
    completionBar.style.width = percent + "%";
    completionText.textContent = percent + "%";
    completionMessage.innerHTML = percent === 100
        ? '<span class="text-green-600 font-bold">✔ Profile Complete</span>'
        : 'Complete all fields to unlock jobs';
}

// ============================
// SKILLS LOGIC
// ============================
function renderSkills() {
    skillsContainer.innerHTML = "";
    skills.forEach((s, i) => {
        const tag = document.createElement("div");
        tag.className = 'flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100';
        tag.innerHTML = `
            ${s.name} <span class="ml-1 opacity-60 text-[10px]">(${s.level})</span>
            <button onclick="removeSkill(${i})" class="ml-2 hover:text-red-500">
                <i class="fas fa-times"></i>
            </button>
        `;
        skillsContainer.appendChild(tag);
    });
    updateCompletion();
}

window.addSkill = function () {
    const val = skillInput.value.trim();
    if (!val || skills.some(s => s.name.toLowerCase() === val.toLowerCase())) return;
    skills.push({ name: val, level: skillLevelSelect.value });
    skillInput.value = "";
    renderSkills();
}

window.removeSkill = function (i) {
    skills.splice(i, 1);
    renderSkills();
}

// ============================
// RESUME LOGIC
// ============================
resumeInput?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return alert("Only PDFs allowed!");
    if (file.size > 2 * 1024 * 1024) return alert("Max 2MB");

    const dropArea = document.getElementById("resumeDropArea");
    const originalHTML = dropArea.innerHTML;
    
    // Show AI parsing loading state
    dropArea.innerHTML = `
        <div class="flex flex-col items-center justify-center py-4">
            <i class="fas fa-spinner fa-spin text-4xl text-blue-500 mb-3 animate-spin"></i>
            <p class="text-blue-600 font-bold">Assistant is reading your resume...</p>
            <p class="text-xs text-gray-400 mt-1">AI will automatically fill your profile fields</p>
        </div>
    `;
    dropArea.style.pointerEvents = "none";

    const formData = new FormData();
    formData.append("resume", file);

    try {
        const res = await fetch(`${API_BASE}/upload-resume`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Failed to process resume");
        }

        const data = await res.json();
        const profile = data.student;

        // Auto-fill forms based on AI extraction
        if (profile.name) fullNameInput.value = profile.name;
        if (profile.roll) rollInput.value = profile.roll;
        if (profile.cgpa) cgpaInput.value = profile.cgpa;

        if (profile.branch) {
            Array.from(branchSelect.options).forEach(o => {
                if (o.text === profile.branch || o.value === profile.branch) o.selected = true;
            });
        }

        // Auto-fill skills
        skills = (profile.skills || []).map(s => ({ name: s, level: "Intermediate" }));
        renderSkills();

        // Load PDF as base64 for local viewing
        const reader = new FileReader();
        reader.onload = () => {
            resumeBase64 = reader.result;
            showResumeUI(file.name);
            updateCompletion();
        };
        reader.readAsDataURL(file);

        alert("🎯 AI successfully parsed your resume and auto-populated your profile details!");

    } catch (err) {
        console.error("AI Parser Error:", err);
        alert("❌ AI parsing failed: " + err.message);
    } finally {
        dropArea.innerHTML = originalHTML;
        dropArea.style.pointerEvents = "auto";
    }
});

function showResumeUI(name) {
    resumeActions.classList.remove("hidden");
    resumeFileName.textContent = name || "Saved_Resume.pdf";
}

viewPdfBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (!resumeBase64) return;
    const win = window.open();
    win.document.write(`<iframe src="${resumeBase64}" style="width:100%;height:100vh" frameborder="0"></iframe>`);
});

removeResumeBtn?.addEventListener("click", () => {
    resumeBase64 = null;
    resumeInput.value = "";
    resumeActions.classList.add("hidden");
    updateCompletion();
});

// ============================
// LOAD PROFILE FROM BACKEND
// ============================
async function loadProfile() {
    try {
        const res = await fetch(`${API_BASE}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const profile = await res.json();

        fullNameInput.value = profile.name || "";
        rollInput.value = profile.roll || "";
        cgpaInput.value = profile.cgpa || "";

        Array.from(branchSelect.options).forEach(o => {
            if (o.value === profile.branch || o.text === profile.branch) o.selected = true;
        });

        skills = (profile.skills || []).map(s => ({ name: s, level: "Intermediate" }));
        renderSkills();

        if (profile.resume) {
            resumeBase64 = profile.resume;
            showResumeUI("Saved_Resume.pdf");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to load profile");
    } finally {
        updateCompletion();
    }
}

// ============================
// SAVE PROFILE
// ============================
saveBtn?.addEventListener("click", async () => {
    const payload = {
        name: fullNameInput.value.trim(),
        roll: rollInput.value.trim(),
        branch: branchSelect.value,
        cgpa: parseFloat(cgpaInput.value) || 0,
        college: "GH Raisoni",
        skills: skills.map(s => s.name),
        resume: resumeBase64
    };

    try {
        saveBtn.innerText = "Saving...";
        saveBtn.disabled = true;

        const res = await fetch(`${API_BASE}/profile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Save failed");

        alert("✅ Profile saved successfully!");
    } catch (err) {
        console.error(err);
        alert("❌ Save failed");
    } finally {
        saveBtn.innerText = "Save Profile Changes";
        saveBtn.disabled = false;
    }
});

// ============================
// INIT
// ============================
document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
});
