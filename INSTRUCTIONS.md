# 📖 Project Instructions & File Overview

Welcome to the **PlaceMentor369** project! This document provides a comprehensive guide to the repository's file structure and the working principles of each component.

---

## 📂 Root Directory
| File Name | Working Principle |
| :--- | :--- |
| `readme.md` | 📜 The main documentation file providing a project overview, installation steps, and tech stack details. |
| `INSTRUCTIONS.md` | 🗺️ (This file) A detailed map of the project structure and file functionalities. |
| `Contributing.md` | 🤝 Guidelines and workflows for developers looking to contribute to this open-source project. |
| `SECURITY.md` | 🛡️ Instructions on how to report security vulnerabilities and our commitment to platform safety. |
| `LICENSE.md` | ⚖️ The legal framework (MIT License) under which this software is distributed. |
| `package.json` | 📦 Manages project dependencies, scripts, and metadata for the root environment. |

---

## 🖥️ Backend (`/backend`)
The engine of the platform, built with Node.js, Express, and MongoDB.

| Component | Working Principle |
| :--- | :--- |
| `server.js` | 🚀 The heart of the backend. It initializes the Express server, connects to MongoDB, and registers all API routes. |
| `seed.js` | 🌱 A utility script used to populate the database with sample students, recruiters, and job listings for development. |
| `controllers/` | 🎮 Contains the "brains" of the API. Logic for managing jobs, applications, and user profiles is stored here. |
| `models/` | 🏗️ Defines the MongoDB schemas using Mongoose (User, Job, Application, etc.). |
| `routes/` | 🛤️ Maps URL endpoints (e.g., `/api/jobs`) to their respective controller functions. |
| `middlewares/` | 🔐 Handles security tasks like JWT verification and role-based access control (RBAC). |
| `config/` | ⚙️ Centralized configuration for database connections and environment variables. |
| `utils/` | 🛠️ Shared helper functions for tasks like token generation and password hashing. |

---

## 🎨 Frontend (`/frontend`)
The user interface, crafted with semantic HTML, CSS, and interactive JavaScript.

| Component | Working Principle |
| :--- | :--- |
| `index.html` | 🏠 The main landing page. Introduces the platform and provides entry points for all users. |
| `About.html` | ℹ️ Explains the "Why" behind PlaceMentor369, our mission, and unique features. |
| `contact.html` | 📞 A dedicated page for user support, feedback, and founding team information. |
| `login.html` | 🔑 The gateway for existing users to access their respective dashboards. |
| `register.html` | 📝 The onboarding point for new students and recruiters to join the platform. |
| `student/` | 🎓 A directory containing specialized pages for students to browse jobs and track their applications. |
| `recruiter/` | 💼 Contains the recruiter dashboard where jobs are posted and applicants are reviewed. |
| `admin/` | 🛠️ The command center for platform administrators to monitor system-wide metrics. |
| `css/` | 🎨 Modular CSS files that define the visual identity and responsiveness of the platform. |
| `js/` | ⚡ Frontend logic that handles form submissions, UI transitions, and API calls to the backend. |
| `utils/` | 🧰 Small JavaScript helpers for frontend tasks like date formatting or UI state management. |

---

## 🚀 How to Use This Map
- **New Developers**: Start with `readme.md` to get the project running, then refer to `INSTRUCTIONS.md` to find where specific logic resides.
- **UI Designers**: Focus on the `/frontend/css` and `/frontend/index.html` files.
- **Logic Developers**: Dive into `/backend/controllers` and `/backend/models`.

---
*Generated with ❤️ by the PlaceMentor369 Team*
