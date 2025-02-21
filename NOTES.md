<!-- Build on EAS {Expo Application Services} -->
eas login 
eas build:configure
eas build --profile development --platform android
<!-- Once the build completes, install the new APK on your device and test . -->
<!-- We dont need to rebuild again and again like for the UI screens and all -->

A native change means anything that affects the Android or iOS native code, which includes:
-Installing or updating a package that requires native linking
-Modifying native config files (like android/app/build.gradle, ios/Podfile)
-Changing expo-plugin configurations in `app.json` or `eas.json`
-Adding permissions or modifying native behavior


<!-- Checklist  -->
Run expo doctor – if it warns about native dependencies, a rebuild is needed.
    @  Did you only change JS files?
--> No rebuild needed. Just restart Metro with `expo start --clear`.

<!-- Always -->
- Always try running without rebuilding first (`expo start --clear`).
- Check `expo doctor` or  [`npx expo-doctor`] to confirm if a rebuild is needed before using your limited EAS builds.
- If you install or modify native dependencies, rebuild using `eas build --profile development --platform android.`