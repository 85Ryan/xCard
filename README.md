<div align="center">
  <img src="src/assets/xCard_logo.png" alt="xCard Logo" width="120" />
  <h1>xCard - Beautiful Tweet Screenshots</h1>
  <p>Create stunning shareable images of X (Twitter) posts with customizable backgrounds, glassmorphism effects, and more.</p>
</div>

## Features

- **Beautiful Themes**: Light, Dark, and Glassmorphic glass cards.
- **Custom Backgrounds**: Choose from 20+ premium gradients (Midnight Bloom, Nordic Sky, etc.) or solid colors.
- **Smart Export**:
  - **High Quality**: 2x pixel ratio export.
  - **Glass Blur**: True "Double Capture" technology for authentic frosted glass effects.
  - **Transparent Mode**: Export just the card without background.
- **Internationalization**: Fully localized for English, Chinese (Simplified/Traditional), Spanish, Portuguese, and Italian.
- **Native Sync**: UI adapts to X.com's theme (Light/Dim/Dark).

## How to Use

### Method 1: Download from GitHub Releases (Recommended)

1. Go to the [Releases](https://github.com/85Ryan/xCard/releases) page.
2. Download the latest `xCard.zip` file.
3. Unzip the downloaded file.
4. Open Chrome and navigate to `chrome://extensions/`.
5. Enable **Developer mode** in the top right corner.
6. Click **Load unpacked** and select the unzipped xCard folder.

### Method 2: Development Mode

If you want to contribute or modify the code:

1. Clone the repository:
   ```bash
   git clone https://github.com/85Ryan/xCard.git
   ```
2. Install dependencies:
   ```bash
   pnpm install
   # or npm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   # or npm run dev
   ```
4. Load the extension:
   - Go to `chrome://extensions/`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the `dist/` folder in the project directory.
