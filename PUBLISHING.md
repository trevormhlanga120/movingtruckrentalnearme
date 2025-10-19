# Publishing MovingTruckRentalNearMe

This guide covers the minimum steps to prepare and publish the Expo app (MovingTruckRentalNearMe) to app stores and web.

1) App identity
- App name: MovingTruckRentalNearMe
- Expo slug: movingtruckrentalnearme
- Android package: com.movingtruckrentalnearme.app
- iOS bundle identifier: com.movingtruckrentalnearme.app

2) Assets
- Add a high-resolution square icon at `assets/icon.png` (1024x1024) and a splash image at `assets/splash.png`.
- Add `assets/favicon.png` for web.

3) Android publishing (recommended: EAS)
- Install EAS CLI: `npm install -g eas-cli` or `npx eas login`.
- Configure EAS: run `eas build:configure` and follow prompts to set the Android package identifier (use the one above).
- Upload/store your Keystore or let EAS manage it for you. Keep the keystore and credentials safe.
- Build: `eas build -p android --profile production` then follow the build URL and download the `.aab` to submit to Play Console.

4) iOS publishing (EAS recommended)
- Configure Apple credentials; EAS can manage provisioning profiles and certificates.
- Build: `eas build -p ios --profile production` and download the `.ipa` or submit from EAS to App Store Connect.

5) Web
- Run `npm run build:web` to generate `web-build/`. Deploy `web-build/` to any static host (Vercel, Netlify, S3+CloudFront) or use `Dockerfile.web` + nginx.

6) Store listing
- Prepare screenshots, privacy policy URL, marketing text, and correct categories in Google Play and App Store Connect.

7) Testing before publishing
- Test Android debug/production build on real device or emulator.
- Test iOS build on TestFlight.

8) Additional notes
- Update any legal/contact info in the app and server env (EMAIL_TO / EMAIL_FROM).
- If you want, I can add a GitHub Actions workflow to automate EAS builds when you push tags or create releases.
