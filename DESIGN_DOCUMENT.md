# Project Design Document: When Does It Get Good?

**Project Name:** When Does It Get Good? (WDIGG)

---

## 1. Executive Summary

**"When Does It Get Good?"** is a lightweight, crowdsourced utility site for television audiences. It solves the "Three Episode Rule" dilemma by allowing users to vote on the specific episode where a TV series "clicks" or becomes essential viewing.

The goal is to provide a single, clean data point: **"Start watching, but don't quit until Episode X."**

---

## 2. Core Features

The application focuses on speed, anonymity, and a functional "Web 2.0" aesthetic to encourage participation and provide clear data.

1. **Search & Discovery:**
   * Global search bar in the header for instant access from any page.
   * Hero search on the landing page for clear onboarding.
   * Autocomplete results powered by TMDB API.
   * "Trending Now" list based on recent voting activity.

2. **The "Verdict" Page (Show Details):**
   * Displays show metadata (Poster, Overview, Genres, Seasons).
   * **The Core Metric:** A clear community consensus: *"It gets good at Season X, Episode Y."*
   * **Distribution Chart:** A bar chart (via Recharts) showing the spread of votes across episodes.
   * **Feedback Tags:** Community sentiment indicators ("Worth the wait" vs. "Don't waste time").

3. **Voting Mechanism:**
   * Frictionless voting (No accounts required).
   * Select Season -> Select Episode -> (Optional) Add Tag.
   * **Security:** Fingerprint validation (IP Address + User Agent Hash) to prevent spam while allowing independent voting from shared networks.

---

## 3. Technical Architecture

### **The Stack**

* **Runtime:** **Bun** (High-performance JS runtime and package manager).
* **Framework:** **Astro (SSR Mode)** (Excellent SEO and server-side rendering with Node adapter).
* **Interactivity:** **React** (Used for interactive "Islands" like Search and Voting).
* **Database:** **PostgreSQL** (via **Prisma ORM** for type-safe schema management).
* **Styling:** **Tailwind CSS** (Customized for a "Web 2.0" aesthetic: squared corners, high-contrast borders).
* **Charts:** **Recharts** (Visualizing vote distribution).
* **Data Source:** **TMDB API** (TV metadata and search).

### **Infrastructure**

* **Server:** Oracle Cloud Compute Instance.
* **Web Server:** Nginx (Reverse Proxy with SSL).
* **Process Manager:** PM2 (Managing the Astro server entry point via Bun).

---

## 4. Data Strategy

### **Database Schema (Prisma)**

**Model: `shows`**
* `id`: Int (PK)
* `tmdb_id`: Int (Unique)
* `title`: String (VarChar 255)
* `poster_path`: String (VarChar 255)
* `total_seasons`: Int
* `last_updated`: DateTime (Timestamp)

**Model: `votes`**
* `id`: Int (PK)
* `show_id`: Int (FK to `shows`)
* `season_no`: Int
* `episode_no`: Int
* `tag`: String (VarChar 32, nullable) - "worth-wait" or "dont-waste"
* `fingerprint`: String (VarChar 64) - Hash of (IP + User Agent)
* `created_at`: DateTime (Timestamp)

---

## 5. User Flow

1. **Landing:**
   * User sees a clean, Web 2.0 interface with a hero search.
   * Trending shows provide immediate entry points.
2. **Search:**
   * Autocomplete dropdown shows titles and years.
   * User selects a show and navigates to `/show/[tmdb_id]-[slug]`.
3. **Verdict:**
   * User views the calculated "Verdict" based on aggregated votes.
   * Distribution chart shows where other users "clicked" with the show.
4. **Vote:**
   * User selects their own "click" episode.
   * Optionally tags it as "Worth the wait" or "Don't waste time".
   * Vote is recorded; statistics update on the next page load.

---

## 6. Design Principles (Web 2.0 Aesthetic)
* **Squared Corners:** No `rounded-full` or large radii; primarily `rounded-sm` or sharp corners.
* **Borders & Shadows:** 1px borders with subtle, high-quality shadows.
* **High Contrast Headers:** Use of dark blue (`#2b5876`) and grey headers to define sections.
* **Data-First:** Clear, bold typography for statistics and metrics.
