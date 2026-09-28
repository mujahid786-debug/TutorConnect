# TutorConnect — Find Your Teacher

A responsive tutor-finder starter website for Pakistan, built with HTML, CSS, JavaScript modules, and optional Firebase.

## Included
- Responsive landing page and navigation
- Search by subject, city, class level, and teaching mode
- Sample teacher cards with WhatsApp contact links
- Teacher registration form (local demo saves to browser memory; Firebase mode submits to Firestore)
- Teacher login interface using Firebase Authentication
- Firebase starter config and conservative Firestore rules

## Run locally
Because the app uses JavaScript modules, serve it through a local web server (not by double-clicking `index.html`).

**Python:** in this folder run:
```bash
python -m http.server 8000
```
Then open http://localhost:8000.

Alternatively, use the VS Code Live Server extension.

## Configure Firebase
1. Open https://console.firebase.google.com/ and create a project.
2. Add a Web App and copy its configuration into `firebase-config.js`.
3. In Firebase Authentication, enable Email/Password sign-in.
4. Create a Cloud Firestore database.
5. Review `firestore.rules`. The included rules intentionally block public writes. For a real launch, implement authenticated teacher submissions and admin-only approval with secure role-based rules or a trusted backend/Cloud Function. Never rely on a hidden admin button or client-side check for security.
6. Create admin users and implement custom claims / server-side authorization before enabling an admin dashboard.

**Important:** This starter is not a production-ready admin system. It includes a teacher login entry point and approval-aware listing logic, but a secure teacher dashboard and admin approval workflow require authentication, authorization rules, and backend support. Do not put service-account credentials in frontend code.

## Publish free with GitHub Pages
1. Create a GitHub account and a new repository named `tutorconnect`.
2. Upload `index.html`, `styles.css`, `app.js`, `firebase-config.js`, and other project files.
3. Open repository **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for the deployment link shown in the Pages section.
6. Add your deployed domain to Firebase Authentication's authorized domains if you use sign-in.

GitHub Pages serves static files for free. Firebase's free tier may be sufficient for a small prototype, but quotas and availability can change. A custom domain is optional and usually costs money.

## Notes before launch
- Replace demo teacher records with real, consented profiles.
- Update contact email and privacy/terms pages.
- Add consent, spam protection, phone verification, reporting, and data deletion workflows.
- Confirm fees, teacher qualifications, and profile approval before publishing.
