# Artefact
Location-bound AR messaging on Arkiv + Polkadot, so every place can hold a story that only shows up when you are there.

## Overview
Physical places currently lose their histories the moment we walk away. Artefact lets explorers, campus communities, city labs, and event attendees drop short AR messages that are anchored to a real GPS point, then persisted on Arkiv’s immutable ledger. The platform surfaces those contextual notes through a browser-native AR and console experience, so anyone who arrives at that place can unlock the hidden story, revisit it through Arkiv’s explorer, or canonize it on Polkadot Hub’s TestNet for a trusted record.

## Key Features
- **Location-bound notes** — Create board/scene pairs that live on a map pin and expire when their TTL runs out.
- **Browser-native AR flow + console** — The marketing landing page explains the vision, while the `/console` view wires up board/scene inputs, message text, tier selection, and TTL overrides.
- **Tiered TTL controls** — Free tier defaults to 1 day on Arkiv, extended tier keeps entities alive longer, and relic tier adds a wallet-signed canonization step.
- **Arkiv-backed storage** — Notes go on Arkiv through `walletClient.createEntity`, complete with typed attributes (`type`, `boardId`, `sceneId`, `tier`), JSON payloads, and configurable expiration.
- **Polkadot Hub canonization** — Relics hash the message text and emit a minimal payload via `viem` to the Polkadot Hub TestNet, creating a blockchain-level reference alongside Arkiv’s entity.
- **Explorer-ready UX** — After publishing, the UI surfaces the Arkiv tx hash and entity key so you can inspect the payload through Arkiv Explorer or share the note metadata with others.

## How Arkiv Is Used
- **Creating notes:** `/api/notes/open` calls `noteService.openNote`, which packages the board, scene, message text, optional geo coords, TTL, tier, and source into `jsonToPayload`. `walletClient.createEntity` writes that payload with `contentType: application/json`, a 24-hour default TTL (`ONE_DAY`), optional custom minutes, and attributes such as `boardId`/`sceneId`/`tier`.
- **Listing notes:** `/api/notes/list` queries Arkiv via `publicClient.buildQuery()` filtered by `type=note`, `boardId`, and optionally `sceneId`. The response includes decoded payload, TTL, owner, and current `expiresAtBlock`.
- **Extending TTL:** `/api/notes/extend` reuses `walletClient.extendEntity`, letting the frontend bump the expiration window if the user sets a new minute value or selects an extended tier.
- **Exploration:** The console UI instructs the AR lens to fetch those entity IDs and render them in place; explorers copy the Arkiv tx hash or entity key into the Arkiv Explorer (linked from the Arkiv docs) to validate the stored payload.
- **Arkiv docs:** Follow the Arkiv developer guide for Mendoza testnet usage: https://arkiv.network/docs.

## User Flow / Demo Walkthrough
1. Open the Artefact dApp (landing page or `/console`) and think through the board + scene context you want to tag.
2. Enter board ID (e.g., `sub0`), scene ID (`main_hall`), and the message you want to pin to the physical spot.
3. Choose a tier — Free defaults to 1 day, Extended gives extra time, Relic adds Polkadot Hub signing — and optionally override TTL in minutes.
4. Click **Publish note** to send the request to `/api/notes/open`, which writes the entity to Arkiv and returns the entity key + tx hash.
5. (Relic only) Connect MetaMask to Polkadot Hub TestNet, sign the canonization prompt, and shoot the canonical payload to `/api/notes/canonize`.
6. Copy the Arkiv tx hash or entity key from the response and paste it into Arkiv Explorer for transparency, or let the AR lens surface the saved note when you reach that GPS point.

## Live Demo
Live demo: https://artifact-arkiv.replit.app

## Videos
- **Pitch Video (2–3 minutes):** https://youtu.be/sA_v2gKC_A0 — quick pitch on Artefact’s thesis and Arkiv usage.
- **Demo Walkthrough:** https://youtu.be/B5hMgRAFLpc — hands-on walk-through of the console + AR note publishing flow.

## Concept Deck
[Artefact Pitch Deck](./artefact_pitch.pdf) — covers the core idea, adoption strategy, and execution roadmap for Artefact.

## Architecture
1. **Next.js + React** front-end (landing page + `/console`) that handles state, wallet prompts, and tier selection.
2. **API routes under `/api/notes/*`** drive Arkiv business logic: `open` (create), `list` (query), `extend` (renew), `canonize` (Polkadot Hub relay).
3. **`noteService`** uses `@arkiv-network/sdk` clients to write entities, while `canonService` hashes the text and posts to Polkadot Hub through `viem`.
4. **External services:** Arkiv (Mendoza testnet via `RPC_URL`, `PRIVATE_KEY`) and Polkadot Hub TestNet (`POLKADOT_HUB_RPC`, `POLKADOT_HUB_PRIVATE_KEY`) supply immutable storage and canonized records.

```
Browser (Landing / Console)
└─> /api/notes/open/list/extend → noteService → Arkiv Mendoza (create/query/extend)
                      ↘
                       canonService → Polkadot Hub TestNet (relic tx)
```

## Getting Started / How to Run It
1. **Prerequisites**
   - Node.js 18+ (Next.js 16) and npm.
   - A Mendoza-compatible Arkiv RPC endpoint and private key.
   - A Polkadot Hub TestNet RPC, chain ID, and wallet private key for relic canonization.
2. **Clone**
   ```bash
   git clone https://github.com/your-org/artefact.git
   cd artefact
   npm install
   ```
3. **Environment**
   Create a `.env.local` with:
   ```env
   PRIVATE_KEY=0x...            # Arkiv wallet private key
   RPC_URL=https://mendoza.arkiv.network   # Arkiv Mendoza RPC endpoint
   POLKADOT_HUB_PRIVATE_KEY=0x...  # Wallet that sends relic txs
   POLKADOT_HUB_RPC=https://testnet-passet-hub-eth-rpc.polkadot.io
   POLKADOT_HUB_CHAIN_ID=420420422
   ```
   Adjust URLs or keys for your deployments; the app throws if required vars are missing.
4. **Run locally**
   ```bash
   npm run dev
   ```
   The app listens on port 5000; visit http://localhost:5000 for the landing page and `/console` to try the Arkiv workflow.
5. **Build for production**
   ```bash
   npm run build
   npm run start
   ```

## Project Status & Next Steps
- **Current status:** Landing page storytelling, console-driven Arkiv note creation, TTL tiers, Arkiv entity listing, and optional relic canonization on Polkadot Hub TestNet are functional.
- **Next steps:** Expand AR/web lens discovery UX, add multi-user boards and richer search, integrate location verification, explore mobile-native overlays, refine TTL tiers & analytics, refine TTL tiers & analytics, and iterate on the hosted demo based on user feedback..

## Milestone 2: 6-Week Development Roadmap

### Overview

This document outlines the development approach for the next 6 weeks, focusing on polishing Artefact’s foundation, enhancing features, and preparing for initial market validation.

**Timeline**: 6 weeks  
**Focus**: Feature enhancement, polish, testing, and initial market presence

**Status**: Core functionality (AR camera, Arkiv integration, wallet connection) has been completed in the previous milestone.

---

## Week 1-2: Feature Enhancement & Polish

### Message System
- Rich media support (images, audio, short videos)
- Message editing and deletion (within time limits)
- Message discovery radius and proximity detection
- Message history and personal archive

### UI/UX Improvements
- Mobile responsiveness optimization
- AR view interface refinement
- Loading states and error handling
- Performance optimization (lazy loading, image compression)

### Core Features Completion
- Time-limited message expiration system
- Message search and filtering
- Basic analytics (message views, interactions)
- Notification system for nearby messages

**Deliverables**: Polished message system, improved UX, mobile-ready interface

---

## Week 3-4: Testing & Quality Assurance

### Testing
- Unit tests for core functions
- Integration tests for Arkiv Network
- AR functionality testing across devices
- Cross-browser compatibility testing

### Bug Fixes & Refinement
- Address performance issues
- Fix UI/UX inconsistencies
- Improve error messages and user feedback
- Security audit and improvements

### Documentation
- API documentation
- User guide for message creation
- Developer setup guide
- Troubleshooting guide

**Deliverables**: Stable, tested version ready for beta users

---

## Week 5: Initial Marketing & Launch Prep

### Marketing Materials
- Landing page optimization
- Demo video creation
- Social media presence setup
- Blog post about Artefact vision

### Community Building
- Discord/Telegram community setup
- Initial user onboarding flow
- Feedback collection system
- Beta tester recruitment

### Launch Preparation
- Mainnet deployment preparation
- Final security checks
- Performance monitoring setup
- Analytics integration

**Deliverables**: Marketing presence, community channels, ready for beta launch

---

## Technical Priorities

### Must-Have Features
- ✅ AR camera access and marker placement
- ✅ Message creation and storage on Arkiv
- ✅ Message discovery via geolocation
- ✅ Time-based expiration
- ✅ Wallet connection

### Nice-to-Have Features
- Message reactions/interactions
- Message sharing between users
- Advanced filtering and search
- Message analytics dashboard
- Social features (following, favorites)

### Future Considerations (Post-Milestone 2)
- Multi-chain support
- Advanced AR features (3D objects, animations)
- Community moderation tools
- Monetization options
- API for third-party integrations

---

## Success Metrics

### Technical Metrics
- Message creation success rate > 95%
- AR marker detection accuracy > 90%
- Average message load time < 2 seconds
- Mobile compatibility across major browsers

### User Metrics
- Beta user signups: 50+ users
- Messages created: 200+ messages
- Active discovery sessions: 100+ per week
- User retention: 40% weekly active users

---

## Risk Mitigation

### Technical Risks
- **AR compatibility**: Focus on WebXR standard, provide fallbacks
- **Geolocation accuracy**: Use multiple positioning methods, allow manual adjustment
- **Network latency**: Implement caching, optimize payload sizes
- **Storage costs**: Monitor Arkiv Network usage, optimize data structure

### Product Risks
- **User adoption**: Start with focused use cases, gather early feedback
- **Content moderation**: Implement basic reporting, plan for community moderation
- **Privacy concerns**: Clear privacy policy, transparent data handling

---

## Resources Needed

### Development
- Polkadot.js SDK integration
- Arkiv Network SDK and documentation
- WebXR/AR libraries and tools
- Testing infrastructure

### Design
- AR interface mockups
- Mobile UI refinements
- Marketing assets creation

### Community
- Discord/Telegram moderation
- Content creation for marketing
- Beta tester recruitment

---

## Timeline Summary

| Week | Focus Area | Key Deliverables |
|------|------------|------------------|
| 1-2  | Feature Enhancement | Message system, UI polish, mobile-ready |
| 3-4  | Testing & QA | Testing, bug fixes, documentation |
| 5    | Marketing & Launch | Marketing materials, community, beta prep |

---

## Acknowledgements
Thanks to Arkiv Network for the Mendoza tooling and Kusama/Polkadot for the Polkadot Hub infrastructure that backs our canonization flow. Artefact is built for Arkiv’s main track and Kusama’s experimental spirit — big thanks to the organizers and judges for this space to innovate.
