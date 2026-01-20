Here is the updated Project Design Document, refined to include the technical decisions we made regarding the database schema (Prisma/TEXT fields) and the security strategy (Fingerprinting).

# Project Design Document

**Project Name:** When Does It Get Good?

---

## 1. Executive Summary

**"When Does It Get Good?"** is a lightweight, crowdsourced utility site for television audiences. It solves the "Three Episode Rule" dilemma by allowing users to vote on the specific episode where a TV series "clicks" or becomes essential viewing.

The goal is to provide a single, clean data point: **"Start watching, but don't quit until Episode X."**

---

## 2. Core Features (MVP)

The Minimum Viable Product (MVP) will focus on speed and anonymity to encourage high participation.

1. **Search & Discovery:**
* Users can search for any TV show (powered by TMDB API).
* Autocomplete results for fast navigation.


2. **The "Verdict" Page (Show Details):**
* Displays basic show info (Poster, Plot, Network).
* **The Core Metric:** A visual graph or clear statement: *"Most users say this show gets good at Season 1, Episode 4."*
* Breakdown of votes per episode.


3. **Voting Mechanism:**
* Frictionless voting (No user accounts required).
* Simple interface: Select Season -> Select Episode -> "This is when it got good."
* **Security:** "Fingerprint" validation (IP Address + User Agent Hash) to prevent spam while allowing roommates/shared Wi-Fi users to vote independently.



---

## 3. Technical Architecture

### **The Stack**

* **Runtime:** **Bun**
* *Rationale:* High performance, built-in package manager.


* **Framework:** **Astro (SSR Mode)**
* *Rationale:* Excellent SEO, zero-JS by default for static content.


* **Interactivity:** **React** (or Svelte)
* *Rationale:* Used strictly for "Islands" (Search Bar, Voting Widget).


* **Database:** **PostgreSQL** (via **Prisma ORM**)
* *Rationale:* Existing infrastructure. Prisma manages schema and type safety.


* **Data Source:** **TMDB API (The Movie Database)**
* *Rationale:* Best-in-class TV metadata.



### **Infrastructure**

* **Server:** Oracle Cloud Compute Instance.
* **Web Server:** Nginx (Reverse Proxy acting as the entry point).
* **Process Manager:** PM2 (Keeps the Astro server alive).

---

## 4. Data Strategy

### **Database Schema (Prisma Models)**

We use two tables. `Shows` caches metadata to respect API rate limits; `Votes` stores user activity.

**Model 1: `Shows**`

* `id`: Int (PK)
* `tmdb_id`: Int (Unique) - *The ID from TMDB*
* `title`: String (Text) - *Changed to TEXT to support long titles*
* `poster_path`: String (VarChar 255) - *Path to the image*
* `total_seasons`: Int
* `last_updated`: DateTime

**Model 2: `Votes**`

* `id`: Int (PK)
* `show`: Relation (FK to Shows)
* `season_number`: Int
* `episode_number`: Int
* `ip_hash`: String - *Hash of (IP Address + User Agent)*
* `created_at`: DateTime

---

## 5. User Flow

1. **Landing Page:**
* Clean, Google-like search bar: "Find a show..."
* "Trending Now" list (Shows with recent voting activity).


2. **Search Action:**
* User types "The Office".
* Dropdown shows "The Office (US)" and "The Office (UK)".
* User clicks "The Office (US)".


3. **Show Page (`/show/[tmdb_id]`):**
* **Server Action:** Astro fetches show metadata (Server-side) + Vote counts (Prisma).
* **Render:** User sees "The Office (US)" header and a Bar Chart spike at **Season 2, Episode 1**.
* **Call to Action:** "Disagree? Vote here."


4. **Voting Action:**
* User clicks "Vote".
* **Island Hydrates:** The React/Svelte component loads.
* User selects "Season 1, Episode 2".
* **Submission:** App hashes IP+UserAgent -> Checks DB -> records vote.
* **Feedback:** Graph updates instantly (Optimistic UI).



---

## 6. Development Phases

1. **Phase 1: Setup**
* Initialize Astro + Bun.
* Set up Postgres DB and Tunnel.
* Configure Prisma.


2. **Phase 2: The Data Layer**
* Create Prisma Schema.
* Write TMDB fetcher utility (Server-side helper).


3. **Phase 3: The Frontend**
* Build the dynamic `/show/[id]` route.
* Build the Voting Component (Interactive Island).


4. **Phase 4: Deployment**
* Build for production.
* Configure Nginx/PM2 on Oracle Cloud.