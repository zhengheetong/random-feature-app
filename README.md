# 🛠️ Random Feature App

A modular, React-based personal dashboard containing a collection of standalone utility widgets, micro-tools, and API-driven features. Built with **React** and **Vite** for lightning-fast performance.

## ✨ Features

This application acts as a central hub for various custom-built tools:

* **🐦 X (Twitter) Post Fetcher:** A high-fidelity tweet renderer that fetches posts via URL and allows you to capture 4K, transparent-background screenshots. Features dynamic corner toggling and bypasses canvas security restrictions for perfect emoji rendering.
* **🎲 Gacha Tracker & Spin Wheel:** Interactive tools for tracking gacha pulls and making random selections.
* **⏱️ Pomodoro / Objectives Tracker:** A focused task manager and timer to keep your productivity high.
* **📱 QR Code Generator:** Instantly converts text or URLs into scannable, downloadable QR codes.
* **📋 Clipboard Saver:** Utilities for managing, extracting, and saving copied data and images.
* **🕒 Utilities:** Quick access to custom clocks, counters, and other quality-of-life micro-features.

## 💻 Tech Stack

* **Core:** React 18, Vite
* **Routing:** React Router v6
* **Key Libraries:** `react-tweet`, `html-to-image` (for DOM-to-PNG high-res rendering)
* **Styling:** CSS3 (with custom Dark Mode themes)

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
```bash
git clone [https://github.com/zhengheetong/random-feature-app.git](https://github.com/zhengheetong/random-feature-app.git)
```

2. Navigate into the directory:
```bash
cd random-feature-app
```

3. Install the dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

## 📂 Project Structure

The application is architected around isolated React components. Each feature lives in its own standalone file, making the dashboard highly scalable and modular.

```text
src/
├── assets/          # Static assets and icons
├── components/      # Standalone feature modules
│   ├── TweetGenerator.jsx
│   ├── GachaTracker.jsx
│   ├── QRCodeGenerator.jsx
│   ├── Clock.jsx
│   ├── Wheel.jsx
│   └── ...
├── App.css          # Global styling and component tweaks
├── App.jsx          # Main routing and dashboard layout
└── main.jsx         # Application entry point
```

## 👨‍💻 Author

**Tong Zheng Hee**
* GitHub: [@zhengheetong](https://github.com/zhengheetong)
* Portfolio: [zhengheetong.github.io](https://zhengheetong.github.io/)