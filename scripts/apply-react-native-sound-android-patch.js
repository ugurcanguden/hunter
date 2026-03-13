const fs = require('fs');
const path = require('path');

function patchReactNativeSound() {
  const targetPath = path.join(
    __dirname,
    '..',
    'node_modules',
    'react-native-sound',
    'android',
    'build.gradle',
  );

  if (!fs.existsSync(targetPath)) {
    return;
  }

  const current = fs.readFileSync(targetPath, 'utf8');

  const original = `def isNewArchitectureEnabled() {
  return rootProject.hasProperty("newArchEnabled") && rootProject.getProperty("newArchEnabled") == "true"
}`;

  const patched = `def isNewArchitectureEnabled() {
  if (!rootProject.hasProperty("newArchEnabled")) {
    return true
  }

  return rootProject.getProperty("newArchEnabled") == "true"
}`;

  if (current.includes(patched)) {
    return;
  }

  if (!current.includes(original)) {
    console.warn('[postinstall] react-native-sound Android patch skipped: expected block not found');
    return;
  }

  fs.writeFileSync(targetPath, current.replace(original, patched));
  console.log('[postinstall] patched react-native-sound Android new architecture detection');
}

function patchReactNativeGradlePlugin() {
  const targetPath = path.join(
    __dirname,
    '..',
    'node_modules',
    '@react-native',
    'gradle-plugin',
    'settings.gradle.kts',
  );

  if (!fs.existsSync(targetPath)) {
    return;
  }

  const current = fs.readFileSync(targetPath, 'utf8');
  const original = `plugins { id("org.gradle.toolchains.foojay-resolver-convention").version("0.5.0") }\n`;

  if (!current.includes(original)) {
    return;
  }

  fs.writeFileSync(targetPath, current.replace(original, ''));
  console.log('[postinstall] disabled foojay resolver in react-native Gradle plugin');
}

function patchReactNativeGoogleMobileAds() {
  const targetPath = path.join(
    __dirname,
    '..',
    'node_modules',
    'react-native-google-mobile-ads',
    'android',
    'build.gradle',
  );

  if (!fs.existsSync(targetPath)) {
    return;
  }

  const current = fs.readFileSync(targetPath, 'utf8');
  const original = `  compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
  }
`;
  const patched = `  compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
  }
`;

  if (current.includes(patched)) {
    return;
  }

  if (!current.includes(original)) {
    console.warn('[postinstall] react-native-google-mobile-ads patch skipped: expected compileOptions block not found');
    return;
  }

  fs.writeFileSync(targetPath, current.replace(original, patched));
  console.log('[postinstall] patched react-native-google-mobile-ads Java compatibility');
}

function patchReactNativeGestureHandler() {
  const targetPath = path.join(
    __dirname,
    '..',
    'node_modules',
    'react-native-gesture-handler',
    'android',
    'build.gradle',
  );

  if (!fs.existsSync(targetPath)) {
    return;
  }

  const current = fs.readFileSync(targetPath, 'utf8');
  const original = `    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
`;
  const patched = `    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
`;

  if (current.includes(patched)) {
    return;
  }

  if (!current.includes(original)) {
    console.warn('[postinstall] react-native-gesture-handler patch skipped: expected compileOptions block not found');
    return;
  }

  fs.writeFileSync(targetPath, current.replace(original, patched));
  console.log('[postinstall] patched react-native-gesture-handler Java compatibility');
}

patchReactNativeSound();
patchReactNativeGradlePlugin();
patchReactNativeGoogleMobileAds();
patchReactNativeGestureHandler();
