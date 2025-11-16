# ARtefact - Location-Bound AR Messaging Platform

## Overview

ARtefact is a location-bound augmented reality messaging platform that enables users to leave digital artifacts in physical spaces. Built on the Polkadot ecosystem with decentralized storage via Arkiv Network, the application allows users to create geo-anchored, time-limited messages discoverable through AR camera views. The platform combines Next.js for the web interface with blockchain technology for secure, tamper-proof message storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Choice**: Next.js 16 with React 19 Server Components
- Rationale: Provides both server-side and client-side rendering capabilities, crucial for handling AR camera interactions while maintaining SEO for landing pages
- App Router structure for file-based routing
- TypeScript for type safety across the codebase

**Animation System**: GSAP with ScrollTrigger and Lenis
- Problem: Creating smooth, engaging scroll-based animations for the landing page
- Solution: GSAP for timeline-based animations, ScrollTrigger for scroll interactions, Lenis for smooth scrolling physics
- Use case: The spotlight section with pinned scrolling and image transformations demonstrates complex scroll-driven animations

**Styling Approach**: Tailwind CSS 4 with Custom CSS
- Hybrid approach combining utility classes with custom CSS for complex layouts
- Design system uses clamp() for responsive typography
- Custom fonts: Instrument Serif for headings, Inter for body text

### Backend Architecture

**API Route Structure**: Next.js API Routes (App Router)
- Organized by domain: `/api/notes/*` for note operations, `/api/polkadot-hub/*` for blockchain queries
- Separation of concerns: Route handlers delegate to service layer

**Service Layer Pattern**:
- `noteService.ts`: Business logic for creating, extending, and listing notes on Arkiv
- `canonService.ts`: Handles "canonization" of notes to Polkadot Hub blockchain
- Rationale: Keeps route handlers thin, makes business logic reusable and testable

**Type System**:
- Shared types in `src/types/note.ts` ensure consistency between services and API routes
- Strongly typed interfaces for `NotePayload`, `StoredNote`, `OpenNoteInput`, etc.

### Blockchain Integration

**Dual-Chain Architecture**:

1. **Arkiv Network (Primary Storage)**:
   - Purpose: Decentralized, time-limited storage for note content
   - SDK: `@arkiv-network/sdk` v0.4.4
   - Features: Entity-based storage with attributes, built-in expiration mechanisms
   - Client setup: Separate wallet client (write) and public client (read)
   - Chain: Mendoza testnet

2. **Polkadot Hub (Canonization Layer)**:
   - Purpose: Creates immutable proof-of-existence for notes
   - Implementation: Uses standard viem for EVM-compatible interaction
   - Pattern: Stores hashed metadata in transaction data field, not full content
   - Rationale: Provides additional layer of verification without duplicating full note storage

**Key Design Decision**: Two-tier storage approach
- Arkiv stores the actual note content with expiration
- Polkadot Hub stores cryptographic proof (hash) for verification
- Pro: Reduces on-chain data while maintaining verifiability
- Pro: Leverages Arkiv's time-based expiration for ephemeral content
- Con: Requires two separate transactions for full canonization flow

### Data Model

**Note Entity Structure**:
```
NotePayload:
- boardId: Logical grouping (e.g., "sub0" for an event)
- sceneId: Specific location within board
- text: Message content (max 500 chars)
- lat/lng: Optional geolocation
- ttlMinutes: Time-to-live (default 24 hours)
- tier: "free" or "extended" (for different expiration policies)
- source: "snap_lens" or "web"
```

**Arkiv Attributes**: Used for querying/filtering
- type: Always "note"
- boardId, sceneId, tier: Indexed for efficient lookups

### API Endpoints

**Note Management**:
- `POST /api/notes/open`: Creates new note entity on Arkiv
- `POST /api/notes/extend`: Extends expiration of existing note
- `GET /api/notes/list`: Queries notes by boardId/sceneId
- `POST /api/notes/canonize`: Writes proof-of-existence to Polkadot Hub

**Utility**:
- `GET /api/polkadot-hub/ping`: Health check for Polkadot Hub connection

### Environment Configuration

**Required Variables**:
- `PRIVATE_KEY`: Arkiv wallet private key (0x-prefixed)
- `RPC_URL`: Arkiv network RPC endpoint
- `POLKADOT_HUB_RPC`: Polkadot Hub RPC URL (defaults to testnet)
- `POLKADOT_HUB_CHAIN_ID`: Chain ID (defaults to 420420422)
- `POLKADOT_HUB_PRIVATE_KEY`: Separate key for Polkadot Hub transactions

### Security Considerations

- Private keys stored in environment variables (server-side only)
- Text content limited to 500 characters to prevent abuse
- Expiration enforced at the Arkiv layer
- No database required - blockchain acts as data layer

## External Dependencies

### Blockchain Networks

**Arkiv Network**:
- Purpose: Decentralized storage layer for time-limited content
- Network: Mendoza testnet
- SDK: `@arkiv-network/sdk` v0.4.4
- Features: Entity storage, attribute indexing, built-in expiration

**Polkadot Ecosystem**:
- Polkadot Hub TestNet (EVM-compatible chain)
- Purpose: Canonization/proof-of-existence layer
- Libraries: `@polkadot/api`, `@polkadot/util`, `@polkadot/util-crypto`
- Additional: Standard viem for EVM interactions

### Third-Party Services

**Animation Libraries**:
- GSAP v3.13.0: Professional-grade animation engine
- ScrollTrigger (GSAP plugin): Scroll-driven animations
- Lenis v1.3.15: Smooth scrolling physics

**Ethereum Tooling**:
- viem v2.39.0: TypeScript EVM client (used for Polkadot Hub)
- Provides account management, transaction signing, chain interactions

### Development Tools

- TypeScript v5: Static typing
- Tailwind CSS v4: Utility-first CSS framework
- ESLint v9: Code quality
- Next.js built-in image optimization

### Font Services

- Google Fonts API:
  - Instrument Serif: Display/heading font
  - Inter: Body text font
  - Geist Sans/Mono: System fonts from Vercel

### Future Integration Points

Based on README features, the application is designed to support:
- Camera-based AR discovery (browser WebRTC/MediaDevices API)
- Geolocation services (browser Geolocation API)
- Media uploads (photos, audio, video) - infrastructure exists but not yet implemented
- Snap Lens integration (source field indicates planned integration)