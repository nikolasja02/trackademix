# Trackademix (Expo + Firebase)

---

### 1. Clone the repo

```bash
git clone https://github.com/nikolasja02/trackademix.git
cd trackademix
npm install
```

### 2. Environment setup

Create a `.env` file in the project root by copying `.env.example`:

```bash
cp .env.example .env
```

Then fill in your Firebase Web App config values (from Firebase Console → Project Settings → _Your apps_ → Web):

```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

> **Note:** These values are shared among teammates; keep `.env` out of GitHub.

---

## 🧩 Firebase Setup

1. **Sign in** at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Ask me for a project invite (check your Google email).
3. In Firebase:
    - **Authentication → Sign-in method:** enable _Email/Password_.
    - **Firestore Database:** click _Create Database_ → _Start in production mode_.
    - **Rules:** paste the contents of `firestore.rules` and click **Publish**.

### 🔒 firestore.rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(uid) {
      return request.auth != null && request.auth.uid == uid;
    }
    match /users/{uid} {
      allow read, write: if isOwner(uid);
      match /{document=**} {
        allow read, write: if isOwner(uid);
      }
    }
  }
}
```

---

## ▶️ Run the app

```bash
npx expo start
```

Then open with:

-   **Expo Go** on your phone (scan the QR code), or
-   **Android emulator / iOS simulator**

---

## 🧪 Demo flow

1. **Sign up** a new account (email + password)
2. **Dashboard** → tap **Seed demo data**
3. See **Due Soon** panel + **Tutoring banner**
4. Open **Courses**, **Assignments**, and **Grades** screens
5. **Profile** → fill in social handles → save
6. **Sign out** and log back in

---

## 👥 Collaboration workflow

1. **Pull latest changes**
    ```bash
    git pull origin main
    ```
2. **Create a feature branch**
    ```bash
    git checkout -b feature/<your-name>-<task>
    ```
3. **Commit and push**
    ```bash
    git add .
    git commit -m "feat: your change"
    git push -u origin feature/<your-name>-<task>
    ```
4. **Open a Pull Request** on GitHub → _main_

---

## 🧰 Tech Stack

-   **Expo / React Native** (TypeScript)
-   **Firebase Authentication**
-   **Cloud Firestore**
-   **React Navigation**
-   **date-fns**

---
