# Jodo Yatra

React Native CLI conversion of the Jodo Yatra campaign app. The original Vite source is preserved in `extracted-app/` for UI reference; the native app is implemented in `App.tsx` and `src/`.

## Run

```bash
npm install
npm start
npm run android
# or
npm run ios
```

The Android emulator or a USB device must be available for `npm run android`. iOS requires macOS and Xcode.

## Architecture

- `src/data/mockData.ts`: domain seed data and entity types.
- `src/presentation/viewmodels/AppViewModel.ts`: observable application state and business mutations.
- `src/presentation/theme.ts`: shared visual tokens and common styles.
- `App.tsx`: native views composed from React Native primitives, preserving the original mobile UI language.