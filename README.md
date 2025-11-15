# ARtefact

<div align="center">

**Every place has a story… share yours.**

A location-bound AR messaging platform built on **Polkadot** and **Arkiv Network** that turns public spaces into living layers of shared memories, notes, and discoveries.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)
[![Powered by Polkadot](https://img.shields.io/badge/Powered%20by-Polkadot-E6007A)](https://polkadot.network/)
[![Storage on Arkiv](https://img.shields.io/badge/Storage-Arkiv%20Network-blue)](https://arkiv.network/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🌟 Overview

ARtefact blends **augmented reality**, **geolocation**, and **decentralized storage** to let people leave digital artefacts in physical space. Messages become part of a place—waiting for someone to walk into the spot and reveal them through their camera.

Built on the **Polkadot** ecosystem with secure, tamper-proof storage via **Arkiv Network**, ARtefact creates a living archive of stories woven into the world.

## ✨ Features

- 🎯 **AR Geolocation Messaging** - Drop time-limited, geo-anchored messages discoverable through AR
- 📷 **Camera-Based Exploration** - Discover digital artefacts by pointing your camera at the world
- ⏱️ **Time-Limited Story Drops** - Messages expire, creating a dynamic, ever-changing landscape
- 🔐 **Decentralized Storage** - Secure, tamper-proof storage via Arkiv Network on Polkadot
- 🌐 **Browser-Native** - No app install required—experience AR messaging directly in your browser
- 🎨 **Lightweight UX** - Expressive, intuitive interface for effortless storytelling

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with React 19
- **Blockchain**: [Polkadot](https://polkadot.network/) ecosystem
- **Storage**: [Arkiv Network](https://arkiv.network/) for decentralized data storage
- **Animations**: GSAP with ScrollTrigger & Lenis smooth scrolling
- **Styling**: Custom CSS with modern design system
- **TypeScript**: Full type safety

## 🏗️ How It Works

### 1. Create
- Open the app in your browser
- Use the AR camera view to place a marker in the real world
- Add your message: text, photo, audio, or short video
- Set expiration time
- Publish to **Arkiv Network** for secure, tamper-proof storage

### 2. Discover
- Explore the world with your camera open
- When you enter a tagged location, artefacts appear as AR markers
- Tap to reveal the story left behind
- Messages expire when their time runs out, leaving room for new ones

### 3. Share
- Invite friends to explore hidden layers around you
- Create shared storytelling trails across cities
- Build community narratives tied to physical spaces

## 🎯 Use Cases

- **Hidden Stories** - Private messages between friends at specific locations
- **Place-Linked Memories** - Location-bound personal memories
- **Moments Left Behind** - Ephemeral experiences tied to places
- **Voices in the City** - Urban storytelling and local narratives
- **Time-Stamped Notes** - Temporal messages with expiration
- **Personal Landmarks** - Custom markers for meaningful spots
- **Walking Narratives** - Story trails across neighborhoods
- **Memory Trails** - Event routes and festival paths
- **Spatial Journals** - Location-based journaling
- **Ephemeral Drops** - Temporary AR experiences

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A modern browser with WebXR/AR support

### Installation

```bash
# Clone the repository
git clone https://github.com/traplordmoses/artifact.git
cd artifact

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🔗 Polkadot & Arkiv Integration

ARtefact leverages the **Polkadot** blockchain ecosystem for:

- **Interoperability** - Connect with other parachains and services
- **Security** - Benefit from Polkadot's shared security model
- **Scalability** - Handle growing user base and data volume

**Arkiv Network** provides:

- **Decentralized Storage** - Tamper-proof, permanent storage for AR messages
- **Data Integrity** - Cryptographic verification of stored content
- **Censorship Resistance** - Messages cannot be removed or altered

## 📁 Project Structure

```
artefact/
├── src/
│   └── app/
│       ├── components/
│       │   └── Navbar.tsx      # Navigation component
│       ├── globals.css          # Global styles
│       ├── layout.tsx           # Root layout
│       ├── page.tsx             # Main page with animations
│       └── icon.svg             # Favicon
├── public/
│   ├── artefact_logo.svg        # Logo
│   └── img_*.jpg                # Hero images
├── package.json
└── README.md
```

## 🎨 Design Philosophy

ARtefact embraces a minimalist, elegant design that puts stories first. The interface uses:

- **Instrument Serif** for hero text - elegant, timeless typography
- **Inter** for body text - clean, modern sans-serif
- Smooth scroll animations with GSAP
- Floating use case badges with organic motion
- Glassmorphism effects for depth

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built on [Polkadot](https://polkadot.network/)
- Storage powered by [Arkiv Network](https://arkiv.network/)
- Animations with [GSAP](https://greensock.com/gsap/)
- Smooth scrolling with [Lenis](https://lenis.studiofreight.com/)

---

<div align="center">

**Every place has a story… share yours.**

Made with ❤️ for the decentralized web

</div>
