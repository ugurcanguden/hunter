# Android Release

`Center Hit` is ready for Android release builds once a Play upload keystore and production ad IDs are filled in.

## 1. Create the upload keystore

From the project root:

```powershell
keytool -genkeypair -v -storetype PKCS12 -keystore keystores/centerhit-upload.keystore -alias centerhit-upload -keyalg RSA -keysize 2048 -validity 10000
```

Keep the generated keystore outside version control. The repo ignores `*.keystore` files already.

## 2. Add signing secrets

Copy `android/release-signing.properties.example` to `android/release-signing.properties` and replace the sample values:

```properties
storeFile=../keystores/centerhit-upload.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=centerhit-upload
keyPassword=YOUR_KEY_PASSWORD
```

Release builds now fail fast if this file is missing, so we do not accidentally ship a debug-signed build.

## 3. Set release version

Pass the Play version at build time:

```powershell
cd android
.\gradlew bundleRelease -PCENTER_HIT_VERSION_CODE=1 -PCENTER_HIT_VERSION_NAME=0.0.1
```

Increase `CENTER_HIT_VERSION_CODE` for every Play upload.

## 4. Replace Android AdMob IDs

Before store rollout, replace the Android test IDs in these files with production values:

- `app.json` -> `react-native-google-mobile-ads.android_app_id`
- `src/features/ads/config/adUnits.ts` -> Android banner and interstitial unit IDs

Right now Android is still pointed at the Google sample app ID and empty production unit IDs, which is fine for development but not for a real Play release.

## 5. Build artifact

Run:

```powershell
cd android
.\gradlew bundleRelease -PCENTER_HIT_VERSION_CODE=1 -PCENTER_HIT_VERSION_NAME=0.0.1
```

The Play Console upload file will be created at:

`android/app/build/outputs/bundle/release/app-release.aab`
