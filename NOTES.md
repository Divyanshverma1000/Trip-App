# 📌 EAS (Expo Application Services) Build Guide

## 🚀 First-Time Setup
```sh
npm install -g eas-cli
```

## 🔧 Building on EAS
```sh
eas login 
eas build:configure
eas build --profile development --platform android
```
> 🎯 Once the build completes, install the new APK on your device and test.
> You **don’t** need to rebuild for UI changes—just reload Metro!

---

## 🏗️ Configuring Your Project
Before building, update your `app.json` file in the root directory by adding your **EAS Project ID**:
```json
"extra": {
  "eas": {
    "projectId": "f8031d21-5772-4ead-9a37-8687b2a0be49"
  }
}
```
Copy the **Project ID** and ensure it's set correctly before proceeding with EAS services.

---

## 📲 Running the App on Your Device
1. First, build the **development APK** for Android/iOS:
   ```sh
   eas build --profile development --platform android
   ```
2. Install the **APK** on your device.
3. Install the **Expo Go App**.
4. Start Metro Bundler with tunnel mode:
   ```sh
   npx expo start --tunnel
   ```
   or force clear cache and start:
   ```sh
   npx expo start -c --tunnel
   ```
   This will allow you to run the development build with additional dev features.

---

## 🏗️ When is a Rebuild Needed?
A **native change** includes:
- Installing or updating a package that requires native linking
- Modifying native config files (`android/app/build.gradle`, `ios/Podfile`, etc.)
- Changing Expo plugin configurations in `app.json` or `eas.json`
- Adding permissions or modifying native behavior

---

## ✅ Rebuild Checklist
### Run `expo doctor` or `npx expo-doctor` before rebuilding:
✔ **Did you only change JS files?** → **No rebuild needed!** Just restart Metro:
```sh
expo start --clear
```

✔ **Did you modify native dependencies?** → **Rebuild required**:
```sh
eas build --profile development --platform android
```

> 💡 Always try running without rebuilding first (`expo start --clear`).
> Check `expo doctor` to confirm if a rebuild is needed before using your limited EAS builds.

---

## 📦 Build Profiles
| Purpose                   | Command |
|---------------------------|---------|
| 🛠️ Development Build (Debugging) | `eas build --profile development --platform android` |
| 🔄 Preview Build (Sharing with friends) | `eas build --profile preview --platform android` |
| 🎯 Production Build (Play Store/App Store) | `eas build --profile production --platform android` |
| 📤 Submit to Google Play | `eas submit --platform android` |
| 🍏 Submit to Apple App Store | `eas submit --platform ios` |

---

💡 **Pro Tip:** Always check for native dependency issues using:
```sh
expo doctor
```

Happy building! 🚀

---

## 🔥 @Team Collaboration
### Team Members:
- **Divyansh Verma** ([@divyanshverma1000](https://github.com/divyanshverma1000))
- **Dhruv Gupta** ([@dhruvgupta2112](https://github.com/dhruvgupta2112))
- **Kush Mahajan** ([@kushrm2803](https://github.com/kushrm2803))
- **Priyanshu** ([@bakasingh](https://github.com/bakasingh))

Let's build something amazing together! 🚀💡
