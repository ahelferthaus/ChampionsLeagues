# Champions Leagues - Complete Business & Technical Specification

**Document Version**: 1.0
**Date**: March 7, 2026
**Classification**: Confidential
**Prepared For**: Champions Leagues Founding Team

---

# TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Business Requirements Document (BRD)](#2-business-requirements-document-brd)
3. [Functional Requirements Document (FRD)](#3-functional-requirements-document-frd)
4. [User Stories](#4-user-stories)
5. [Technical Requirements Document (TRD)](#5-technical-requirements-document-trd)
6. [System Architecture Document](#6-system-architecture-document)
7. [Functional Specification Document (FSD)](#7-functional-specification-document-fsd)
8. [API Documentation](#8-api-documentation)
9. [Competitive Landscape & Gap Analysis](#9-competitive-landscape--gap-analysis)
10. [Revenue Model Analysis](#10-revenue-model-analysis)
11. [Cost Estimation](#11-cost-estimation)
12. [Production Project Plan](#12-production-project-plan)
13. [Customer Demo Strategy](#13-customer-demo-strategy)

---

# 1. EXECUTIVE SUMMARY

## 1.1 Vision Statement

Champions Leagues is an all-in-one platform for youth competitive sports team management, with a distinctive focus on **travel logistics and expense management** -- a critical pain point that no existing competitor fully addresses. The platform serves clubs, coaches, and parents who manage the complex, stressful, and error-prone process of organizing team travel to out-of-state tournaments and tracking shared expenses.

## 1.2 The Problem

Competitive youth sports clubs (soccer ECNL/MLS NEXT, basketball AAU, hockey AAA, lacrosse, volleyball, etc.) routinely travel out of state for tournaments and league play. This involves:

- **Coordination chaos**: Collecting player availability, names matching government IDs, dietary restrictions, and emergency contacts across 15-25 families
- **Upfront financial burden**: Parents or coaches front thousands of dollars for group flights, hotel blocks, and rental cars -- then chase reimbursements for weeks
- **Spreadsheet hell**: Expense tracking via Google Sheets with inevitable errors, leading to parent disputes and lost trust
- **Fragmented tools**: Teams use 3-5 separate apps (TeamSnap for scheduling, Venmo for payments, Google Sheets for expenses, email for coordination, a travel agent for hotels)
- **Volunteer burnout**: The parent who volunteers to coordinate travel once rarely does it again

## 1.3 The Market

- **Youth Sports Software Market**: $1.53 billion in 2026, growing at 12.5% CAGR to $3.93B by 2034
- **Target TAM (U.S. elite travel teams)**: ~6,000+ youth soccer clubs with ~10,000+ travel teams; ECNL alone has 279+ boys' and 253+ girls' clubs. Expand across 11+ sports (basketball AAU, hockey, lacrosse, baseball, volleyball, tennis, wrestling, gymnastics, swimming, softball)
- **SAM (initial beachhead)**: ~500 elite soccer clubs in Colorado, Texas, California, Florida, with 3-8 travel teams each = ~2,500 teams
- **SOM (Year 1 target)**: 50-100 teams across 10-20 clubs

## 1.4 Current Product State

Champions Leagues has a functional MVP web application built with React/TypeScript/Supabase that includes:

- **Operational**: Club/team creation, user authentication (role-based: club_admin, team_manager, parent, player), roster management, event scheduling, attendance tracking, expense management with Stripe Connect integration, trip planning (demo mode), team messaging, video link sharing, team resources, player stats, and college recruiting tools (AI video advisor)
- **Database**: 24+ tables in Supabase covering clubs, teams, members, child profiles, events, expenses, payments, trips, messages, video links, team resources, and player stats
- **In Progress**: Travel booking APIs (flights, hotels, cars), real-time expense splitting, push notifications, mobile app

---

# 2. BUSINESS REQUIREMENTS DOCUMENT (BRD)

## 2.1 Business Objectives

| # | Objective | Success Metric | Timeline |
|---|-----------|---------------|----------|
| BO-1 | Validate product-market fit with 10 paying clubs | 10 clubs with signed agreements | Q3 2026 |
| BO-2 | Reduce travel coordination time by 75% | Time-tracking surveys pre/post | Q4 2026 |
| BO-3 | Eliminate spreadsheet-based expense tracking | 100% expense flow through platform | Q4 2026 |
| BO-4 | Achieve $10K MRR | Financial reporting | Q1 2027 |
| BO-5 | Expand beyond soccer to 3+ sports | Multi-sport club adoption | Q2 2027 |

## 2.2 Stakeholder Analysis

| Stakeholder | Role | Needs | Pain Points |
|-------------|------|-------|-------------|
| **Club COO / Director** | Enterprise buyer | Single platform for all teams; financial oversight; reduced support burden | Fielding parent complaints about money; no visibility into per-team finances; coaches spending time on admin instead of coaching |
| **Team Manager / Coach** | Day-to-day user | Easy trip creation; automated expense splitting; parent communication | Hours spent on spreadsheets; fronting money on personal credit cards; chasing parents for payments |
| **Parent (Payer)** | End user / Payer | Clear view of what they owe; easy payment; trust in expense transparency | Surprise costs; unclear how money was spent; no visibility into trip planning; paying via Venmo with no receipt |
| **Player** | Passive beneficiary | Game schedule; team info | Limited direct interaction with financial tools |

## 2.3 Business Problems Being Solved

### 2.3.1 Pre-Trip Planning (from Customer Discovery)
- **Who's coming?** Players commit late, coaches/chaperones need separate tracking
- **Name collection**: Full legal names for flights are error-prone with manual entry; integration with systems of record (PlayMetrics) needed
- **Group booking complexity**: Airlines require group bookings with specific timelines (United: 24-hour name/payment deadline; Southwest: 45 days advance, spreadsheet upload)
- **Upfront cost burden**: Someone must front thousands; nobody wants to put $8,000 on their personal card
- **Cancellation cascading**: One player drops out with a non-refundable ticket -- who absorbs the cost?

### 2.3.2 During-Trip Expense Tracking
- **Incidental expenses**: Food, gas, tolls, parking -- tracked by whoever has the team card
- **Coach/chaperone per diems**: Different rules per club
- **Receipt capture**: Photos of receipts that get lost in camera rolls
- **Real-time visibility**: Parents want to know the running total, not a surprise bill 2 weeks later

### 2.3.3 Post-Trip Settlement
- **Per-player cost calculation**: Splitting unevenly (some families share rooms, some fly separately)
- **Collection**: Chasing 15 families for $300-800 each
- **Reconciliation**: Matching expenses to budget, explaining variances
- **Disputes**: "Why was my share $50 more than what you estimated?"

## 2.4 Desired Outcomes

1. **Single source of truth** for trip planning, booking, expense tracking, and settlement
2. **Automated expense splitting** with real-time parent visibility
3. **Integrated payment collection** (Stripe, ACH, Venmo) with audit trail
4. **Club-level financial oversight** across all teams
5. **Reduced volunteer burden** from 15-20 hours per trip to 3-5 hours
6. **Parent trust** through transparent, line-item expense reporting

## 2.5 Scope Boundaries

### In Scope (MVP + V2)
- Club and team management hierarchy
- Trip planning with itinerary builder
- Expense creation, splitting, and collection
- Payment processing (Stripe Connect, Venmo, ACH, manual tracking)
- Team scheduling and calendar
- Roster management with child profiles
- Team messaging
- Attendance tracking
- Player statistics
- College recruiting tools
- Club executive dashboard with financial rollups

### Out of Scope (Future)
- Direct flight/hotel/car booking via API (Phase 3)
- Native mobile apps (Phase 2 - currently responsive web)
- White-label solution for clubs
- Integration with PlayMetrics, TeamSnap, or SportsEngine for roster sync
- AI-powered budget estimation
- Travel insurance brokering
- Merchandise storefront

---

# 3. FUNCTIONAL REQUIREMENTS DOCUMENT (FRD)

## 3.1 Authentication & Authorization

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| AUTH-1 | The system shall support email/password signup and login via Supabase Auth | P0 | Built |
| AUTH-2 | The system shall support four roles: club_admin, team_manager, parent, player | P0 | Built |
| AUTH-3 | Only the "parent" role can be self-assigned during signup (COPPA compliance) | P0 | Built |
| AUTH-4 | Club_admin and team_manager roles must be assigned by an existing admin | P0 | Built |
| AUTH-5 | The system shall fetch and display user profiles (name, avatar, phone, sport, Venmo handle) | P0 | Built |
| AUTH-6 | The system shall support OAuth/SSO login (Google, Apple) | P1 | Not Built |
| AUTH-7 | The system shall support email verification and password reset flows | P1 | Partial |
| AUTH-8 | The system shall support invite-based onboarding for parents added by managers | P1 | Not Built |

## 3.2 Club & Team Management

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| CLUB-1 | Club admins can create clubs with name, description, logo, colors, and league association | P0 | Built |
| CLUB-2 | Club admins can create teams under a club with name, sport, age group, and gender | P0 | Built |
| CLUB-3 | The system shall support a club hierarchy: League > Club > Team | P0 | Built |
| CLUB-4 | Club admins can add team_managers to specific teams | P0 | Built |
| CLUB-5 | Team managers can add parents and players to their team roster | P0 | Built |
| CLUB-6 | Parents can have multiple children (child_profiles) linked to different teams | P0 | Built |
| CLUB-7 | Users can belong to multiple teams and switch between them | P0 | Built |
| CLUB-8 | The system shall persist team selection per user in localStorage | P0 | Built |
| CLUB-9 | The club executive dashboard shall show aggregate stats across all teams (total teams, players, revenue collected, pending payments, upcoming trips) | P0 | Built |
| CLUB-10 | Club admins can manage multiple clubs simultaneously | P1 | Built |

## 3.3 Roster Management

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| ROST-1 | The system shall display a roster table with player name, position, jersey number, and status | P0 | Built |
| ROST-2 | Team managers can add adult members (team_members) and child members (team_child_members) | P0 | Built |
| ROST-3 | Child profiles store date of birth, parent association, jersey number, and position | P0 | Built |
| ROST-4 | Child medical info can be stored (emergency contact, medical notes) | P1 | Built (schema) |
| ROST-5 | The system shall support importing roster data from CSV | P2 | Not Built |
| ROST-6 | The system shall support integration with PlayMetrics for roster sync | P3 | Not Built |

## 3.4 Trip Management

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| TRIP-1 | Team managers can create trips with name, destination, departure date, return date, meeting location, and notes | P0 | Built |
| TRIP-2 | The system shall display upcoming and past trips in separate sections | P0 | Built |
| TRIP-3 | Trips can be exported to ICS calendar format | P0 | Built |
| TRIP-4 | The Trip Planner shall show mock data for flights, hotels, attractions, and dining | P0 | Built (Demo) |
| TRIP-5 | Trip itinerary items support: item type, title, description, start/end times, location, cost estimate, booking reference/URL, age group filtering, and sort order | P0 | Built (Schema) |
| TRIP-6 | The system shall support RSVP tracking per player per trip | P1 | Not Built |
| TRIP-7 | The system shall integrate with airline APIs for group flight search and booking | P2 | Not Built |
| TRIP-8 | The system shall integrate with hotel APIs for room block search and booking | P2 | Not Built |
| TRIP-9 | The system shall integrate with car rental APIs for group vehicle booking | P2 | Not Built |
| TRIP-10 | The system shall support automated name/DOB collection for flight bookings from roster data | P2 | Not Built |
| TRIP-11 | Demo data can be loaded for trips via LoadDemoDataButton | P0 | Built |

## 3.5 Expense & Payment Management

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| EXP-1 | Team managers can create expenses with title, description, category, total amount, due date, and split type | P0 | Built |
| EXP-2 | Expenses can be split equally or custom across team members | P0 | Built |
| EXP-3 | Each parent sees their individual expense shares with pending/paid status | P0 | Built |
| EXP-4 | Parents can pay expense shares via Stripe (card or ACH) through Checkout Sessions | P0 | Built |
| EXP-5 | Team managers can set up Stripe Connect accounts to receive payments | P0 | Built |
| EXP-6 | The system tracks connect account status (onboarding complete, charges enabled, payouts enabled) | P0 | Built |
| EXP-7 | Parents can mark payments as paid via Venmo (with Venmo handle display) | P0 | Built |
| EXP-8 | Managers can manually mark expense shares as paid | P0 | Built |
| EXP-9 | The system shall display total amount due, pending count, and payment history | P0 | Built |
| EXP-10 | Expense categories include: transportation, lodging, food, tournament_fees, equipment, other | P0 | Built |
| EXP-11 | The system shall support receipt photo upload attached to expenses | P1 | Schema Built, UI Not |
| EXP-12 | The system shall send automated payment reminders via email/push | P1 | Not Built |
| EXP-13 | The system shall support recurring/installment payments | P2 | Not Built |
| EXP-14 | The system shall generate expense reports exportable to PDF/CSV | P2 | Not Built |
| EXP-15 | The system shall support real-time expense updates during trips | P2 | Not Built |

## 3.6 Scheduling & Attendance

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| SCHED-1 | Team managers can create events (practice, game, tournament, meeting, other) with title, description, start/end time, location, opponent, and home/away designation | P0 | Built |
| SCHED-2 | The system shall display events in a calendar view (ScheduleCalendar) | P0 | Built |
| SCHED-3 | Events support external ID and source for sync with third-party calendars | P0 | Built |
| SCHED-4 | The system shall support ICS import for bulk schedule creation | P1 | Built |
| SCHED-5 | The system shall track attendance per event per player (present, absent, late, excused) | P0 | Built |
| SCHED-6 | Attendance can be marked by team managers with timestamps and notes | P0 | Built |
| SCHED-7 | Attendance supports both adult members and child members | P0 | Built |

## 3.7 Communication

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| MSG-1 | Team managers can compose and send messages to team members | P0 | Built |
| MSG-2 | Messages have subject, body, sender, and team association | P0 | Built |
| MSG-3 | Messages support group messaging (is_group_message flag) | P0 | Built |
| MSG-4 | Recipients are tracked with read/unread status and read_at timestamps | P0 | Built |
| MSG-5 | The system shall support push notifications for new messages | P1 | Not Built |
| MSG-6 | The system shall support email forwarding of in-app messages | P2 | Not Built |

## 3.8 Player Stats & Video

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| STAT-1 | The system shall track player stats per season: games played, goals, assists, minutes, yellow/red cards | P1 | Built |
| STAT-2 | Team stats per season: wins, losses, ties, goals for/against, league name/rank, division | P1 | Built |
| STAT-3 | Video links can be added with title, URL, platform, thumbnail, and associated event | P1 | Built |
| STAT-4 | The system shall display a player stats table with sortable columns | P1 | Built |
| STAT-5 | The system shall display recent results card with win/loss/draw indicators | P1 | Built |

## 3.9 College Recruiting

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| REC-1 | The system shall provide an AI-powered Video Clip Advisor for college recruiting video guidance | P2 | Built |
| REC-2 | Video Clip Advisor is a paid add-on feature (Stripe payment gated) | P2 | Built |
| REC-3 | College Finder tool for AI-powered school matching | P3 | Not Built |
| REC-4 | Coach Email Writer for AI-assisted outreach to college coaches | P3 | Not Built |

## 3.10 Team Resources

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| RES-1 | Team managers can create resources with title, description, URL, type, category, and icon | P1 | Built |
| RES-2 | Resources can be pinned and sorted by custom order | P1 | Built |
| RES-3 | Resources support categories for organization | P1 | Built |

---

# 4. USER STORIES

## 4.1 Club Administrator Stories

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-CA-1 | As a club admin, I want to create a club so that I can organize my teams under one umbrella | Club is created with name, logo, colors. Admin is automatically added as club_admin. |
| US-CA-2 | As a club admin, I want to see a financial dashboard across all my teams so that I have visibility into collections and outstanding balances | Dashboard shows total teams, total players, revenue collected, pending payments, and upcoming trips aggregated across all teams in my club(s). |
| US-CA-3 | As a club admin, I want to assign team managers so that coaches can manage their own teams | Admin can invite users by email and assign them team_manager role on a specific team. |
| US-CA-4 | As a club admin, I want to set club-wide expense policies (per diem rates, approved vendors) so that all teams follow consistent guidelines | Club-level settings applied to all child teams. *(Not Yet Built)* |
| US-CA-5 | As a club admin, I want to view a breakdown of financials per team so that I can identify teams with collection issues | Per-club breakdown card showing teams, players, collected, and pending amounts per club. |

## 4.2 Team Manager / Coach Stories

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-TM-1 | As a team manager, I want to create a trip with destination and dates so that I can start planning team travel | Trip created with name, destination, departure/return dates, meeting location. Appears in upcoming trips list. |
| US-TM-2 | As a team manager, I want to create an expense and split it among team families so that each parent sees their share | Expense created with total amount and category. Shares created per selected member with calculated amounts. Parents see their pending shares immediately. |
| US-TM-3 | As a team manager, I want to set up a Stripe Connect account so that I can receive online payments from parents | Stripe Connect onboarding initiated. Account status tracked (charges enabled, payouts enabled). |
| US-TM-4 | As a team manager, I want to add events to the team schedule so that parents know when and where to show up | Event created with type, date/time, location, opponent. Visible in calendar view. |
| US-TM-5 | As a team manager, I want to take attendance at events so that I have a record of participation | Attendance marked per player per event with status and notes. |
| US-TM-6 | As a team manager, I want to send messages to all team parents so that I can communicate updates quickly | Message composed with subject/body. All team members receive notification. Read receipts tracked. |
| US-TM-7 | As a team manager, I want to view flight and hotel options for a trip destination so that I can plan team travel *(demo)* | Trip planner shows mock flights with prices, hotels with team discounts, attractions with age filtering, and restaurants with group-friendly indicators. |
| US-TM-8 | As a team manager, I want to see which parents have paid and which haven't so that I can follow up | Expense manager card shows per-member payment status with paid/pending indicators. |

## 4.3 Parent Stories

| ID | Story | Acceptance Criteria |
|----|-------|-------------------|
| US-PA-1 | As a parent, I want to see all my outstanding expenses across teams so that I know exactly what I owe | My Expenses tab shows all pending shares with amounts, expense titles, and due dates. Total amount due displayed prominently. |
| US-PA-2 | As a parent, I want to pay my share via credit card, ACH, or Venmo so that I have payment flexibility | Pay by card (Stripe Checkout), pay by ACH, or mark as paid via Venmo. Payment status updates immediately. |
| US-PA-3 | As a parent, I want to see the team schedule so that I can plan my family's calendar | Calendar view shows all events with type, time, location, and opponent information. |
| US-PA-4 | As a parent, I want to add my child to a team roster so that they appear on the team | Child profile created with name, DOB, jersey number, position. Child added to team. |
| US-PA-5 | As a parent, I want to view trip details so that I know what's planned for my child's away tournament | Trip name, destination, dates, meeting location, and notes visible. Itinerary items shown when available. |
| US-PA-6 | As a parent, I want to see expense line items and receipts so that I trust how the money was spent | Expense detail shows category, total amount, my share, receipt images, and notes. *(Receipt UI not yet built)* |
| US-PA-7 | As a parent, I want to get AI guidance on creating a college recruiting video for my child | Video Clip Advisor provides sport-specific guidance on highlight reel creation. Paid feature with Stripe checkout. |
| US-PA-8 | As a parent, I want to see my payment history so that I have a record of all payments made | Payment history tab shows all paid expenses with dates, amounts, and payment methods. |

---

# 5. TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## 5.1 Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| **Frontend Framework** | React | 18.x | Component-based, massive ecosystem, team expertise |
| **Language** | TypeScript | 5.x | Type safety, better DX, reduced runtime errors |
| **Build Tool** | Vite | 5.x | Fast HMR, modern bundling, ESM-native |
| **CSS Framework** | Tailwind CSS | 3.x | Utility-first, rapid UI development |
| **UI Components** | shadcn/ui (Radix) | Latest | Accessible, customizable, composable primitives |
| **State Management** | React Context + TanStack Query | 5.x | Server state caching + minimal client state |
| **Routing** | React Router DOM | 6.x | Declarative routing, nested routes |
| **Backend/BaaS** | Supabase | Latest | Auth, Postgres DB, Edge Functions, real-time, storage |
| **Payment Processing** | Stripe Connect | Latest | Marketplace payments, Connect for payouts |
| **Form Handling** | React Hook Form + Zod | Latest | Performant forms with schema validation |
| **Charts** | Recharts | Latest | React-native charting library |
| **Hosting** | Lovable (current) | - | Rapid prototyping deployment |

## 5.2 Infrastructure Requirements

### 5.2.1 Production Environment (Target)

| Component | Requirement | Recommendation |
|-----------|-------------|---------------|
| **Database** | PostgreSQL 15+, 8GB minimum | Supabase Pro ($25/mo) or Large Compute ($110/mo) for production |
| **Authentication** | Email/password, OAuth (Google, Apple) | Supabase Auth (included) |
| **File Storage** | Receipt images, profile photos, documents | Supabase Storage (100GB included in Pro) |
| **Edge Functions** | Serverless compute for Stripe webhooks, email sending | Supabase Edge Functions (500K invocations/mo in Pro) |
| **CDN/Hosting** | Static SPA hosting with global CDN | Vercel or Netlify (free tier to start, ~$20/mo at scale) |
| **SSL/TLS** | HTTPS required for all endpoints | Included with hosting provider |
| **Domain** | Custom domain (championsleagues.com or similar) | ~$12/year via Cloudflare Registrar |

### 5.2.2 Third-Party Services

| Service | Purpose | Cost Estimate |
|---------|---------|--------------|
| Stripe Connect | Payment processing | 2.9% + $0.30 per transaction (passed to payer or absorbed) |
| SendGrid / Resend | Transactional email (payment reminders, notifications) | Free to $20/mo for 50K emails |
| Sentry | Error monitoring and performance | Free tier (5K events/mo) |
| PostHog / Mixpanel | Product analytics | Free tier to start |
| Upstash Redis | Rate limiting, caching | Free tier (10K commands/day) |

## 5.3 Security Requirements

| ID | Requirement | Status |
|----|-------------|--------|
| SEC-1 | All data transmitted over HTTPS/TLS 1.3 | Built (Supabase enforced) |
| SEC-2 | Row-Level Security (RLS) policies on all database tables | Partially Built |
| SEC-3 | API keys and secrets stored in environment variables, never in client code | Built |
| SEC-4 | Stripe webhook signature verification | Built (Edge Functions) |
| SEC-5 | COPPA compliance: Only "parent" role self-assignable; child data requires parent association | Built |
| SEC-6 | PCI DSS compliance via Stripe (no card data touches our servers) | Built (Stripe Checkout) |
| SEC-7 | GDPR/CCPA: Data deletion capability, privacy policy, consent tracking | Not Built |
| SEC-8 | Rate limiting on authentication endpoints | Not Built |
| SEC-9 | Input sanitization and XSS prevention | Partial (React handles most) |
| SEC-10 | Audit logging for financial transactions | Not Built |

## 5.4 Performance Requirements

| Metric | Target | Current |
|--------|--------|---------|
| Page Load (LCP) | < 2.5 seconds | ~3-4 seconds |
| Time to Interactive | < 3 seconds | ~4 seconds |
| API Response (P95) | < 500ms | ~800ms |
| Concurrent Users | 1,000+ | Unknown (untested) |
| Database queries per page | < 10 | 5-15 depending on page |
| Uptime SLA | 99.9% | Dependent on Supabase |

## 5.5 Scalability Requirements

| Scale Point | Users | Requirements |
|-------------|-------|-------------|
| Launch (10 clubs) | ~500 users | Supabase Pro plan sufficient |
| Growth (100 clubs) | ~5,000 users | Supabase Large compute, CDN caching |
| Scale (1,000 clubs) | ~50,000 users | Supabase Team plan, read replicas, connection pooling |
| Enterprise (5,000+ clubs) | ~250,000 users | Evaluate self-hosted Postgres or AWS migration |

---

# 6. SYSTEM ARCHITECTURE DOCUMENT

## 6.1 High-Level Architecture

```
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|   React SPA       |<--->|   Supabase        |<--->|   PostgreSQL      |
|   (Vite/TS)       |     |   API Gateway     |     |   Database        |
|                   |     |   + Auth           |     |   (24+ tables)    |
+-------------------+     |   + Realtime       |     +-------------------+
        |                 |   + Storage        |
        |                 +-------------------+
        |                         |
        v                         v
+-------------------+     +-------------------+
|                   |     |                   |
|   Stripe Connect  |     |   Supabase Edge   |
|   (Payments)      |     |   Functions       |
|                   |     |   (Webhooks,       |
+-------------------+     |    Business Logic) |
                          +-------------------+
```

## 6.2 Database Schema (24 Tables)

### Core Entities
- **leagues** - Top-level organizational unit (name, description, logo)
- **clubs** - Sports club belonging to a league (name, description, logo, colors, created_by)
- **teams** - Team within a club (name, sport, age_group, gender, club_id)
- **profiles** - User profile data (full_name, avatar, phone, primary_sport, venmo_handle)
- **user_roles** - Role assignments (user_id, role: club_admin|team_manager|parent|player)
- **club_admins** - Club-level admin assignments (club_id, user_id)

### Membership
- **team_members** - Adult members of a team (user_id, team_id, role, position, jersey_number, is_active)
- **team_child_members** - Child members (child_id, team_id, role, position, jersey_number, is_active)
- **child_profiles** - Children's data (full_name, date_of_birth, parent_user_id, position, jersey_number)
- **child_medical_info** - Medical data (child_id, emergency_contact, medical_notes)

### Scheduling & Attendance
- **events** - Calendar events (team_id, title, event_type, start/end_time, location, opponent, is_home_game, external_id/source)
- **event_attendance** - Per-event attendance (event_id, team_member_id or child_member_id, status, notes, marked_by)
- **seasons** - Season definitions (team_id, name, start/end_date, is_active)

### Financial
- **payments** - Direct payments (team_id, user_id, amount, description, status, due_date, paid_at)
- **expenses** - Team expenses (team_id, club_id, title, category, total_amount, split_type, receipt_url, due_date, status)
- **expense_shares** - Individual shares of expenses (expense_id, user_id, child_id, amount, status, payment_method, stripe_payment_intent_id, paid_at)
- **connected_accounts** - Stripe Connect accounts (user_id, stripe_account_id, club_id or team_id, charges_enabled, payouts_enabled)

### Trips
- **trips** - Trip definitions (team_id, name, destination, departure/return_date, meeting_location, notes)
- **trip_itinerary** - Itinerary items (trip_id, item_type, title, description, start/end_time, location, cost_estimate, booking_reference, booking_url, age_groups, sort_order)

### Communication
- **messages** - Team messages (team_id, sender_id, subject, body, is_group_message)
- **message_recipients** - Message delivery tracking (message_id, user_id or team_member_id, is_read, read_at)

### Content
- **video_links** - Game/training videos (team_id, event_id, title, url, platform, thumbnail_url)
- **team_resources** - Shared resources (team_id, title, url, resource_type, category, is_pinned, sort_order)
- **team_stats** - Season statistics (team_id, season, wins/losses/ties, goals_for/against, league_name/rank)
- **player_stats** - Individual stats (team_member_id, season, games_played, goals, assists, minutes, cards)

## 6.3 Database Functions

| Function | Purpose |
|----------|---------|
| `get_team_member_profiles(_team_id)` | Returns avatar, name, user_id for all members of a team |
| `has_role(_user_id, _role)` | Checks if a user has a specific app_role |
| `is_club_admin(_user_id, _club_id)` | Verifies club admin status |
| `is_parent_of(_user_id, _child_id)` | Verifies parent-child relationship |
| `is_team_manager(_user_id, _team_id)` | Verifies team manager status |
| `is_team_member(_user_id, _team_id)` | Verifies team membership |

## 6.4 Frontend Architecture

```
App.tsx (Root)
  ├── QueryClientProvider (TanStack React Query)
  │   └── AuthProvider (Context: user, session, profile, roles)
  │       └── TeamProvider (Context: selected team, all teams, switching)
  │           └── BrowserRouter
  │               └── Routes
  │                   ├── / → Landing
  │                   ├── /auth → Auth
  │                   ├── /dashboard → Dashboard
  │                   ├── /clubs/create → CreateClub
  │                   ├── /teams/create → CreateTeam
  │                   ├── /payments → Payments
  │                   ├── /trips → Trips
  │                   ├── /schedule → Schedule
  │                   ├── /roster → Roster
  │                   ├── /stats → Stats
  │                   ├── /resources → Resources
  │                   ├── /attendance → Attendance
  │                   ├── /recruiting → Recruiting
  │                   ├── /expenses → Expenses
  │                   └── /profile → Profile
```

### Custom Hooks (Data Layer)
| Hook | Data Source | Operations |
|------|-----------|------------|
| `useAuth` | Supabase Auth + profiles + user_roles | signUp, signIn, signOut, fetchUserData |
| `useUserTeams` | teams + clubs + team_members | Fetch all teams for current user |
| `useRoster` | team_members + team_child_members + child_profiles | CRUD roster members |
| `useEvents` | events | CRUD events with team filtering |
| `useExpenses` | expenses + expense_shares + connected_accounts | Create expenses, split, pay, connect setup |
| `usePayments` | payments | CRUD payments with status updates |
| `useTrips` | trips | CRUD trips |
| `useAttendance` | event_attendance | Mark/update attendance |
| `useMessages` | messages + message_recipients | Send, read, track messages |
| `useClubStatistics` | clubs + teams + payments + trips (aggregated) | Executive dashboard rollups |
| `useTeamResources` | team_resources | CRUD resources |
| `useRecruiting` | N/A (AI-powered, Stripe-gated) | Video advisor access |
| `useEmail` | Supabase Edge Functions | Send transactional emails |

---

# 7. FUNCTIONAL SPECIFICATION DOCUMENT (FSD)

## 7.1 Expense Splitting Flow (Core Differentiator)

### 7.1.1 Creating an Expense

1. **Manager navigates to** Expenses > Team Expenses > Create Expense
2. **Manager fills form**: Title, Description, Category (transportation/lodging/food/tournament_fees/equipment/other), Total Amount, Due Date, Split Type (equal/custom)
3. **Manager selects members** to split the expense among
4. **System calculates** individual share amounts (equal: total / member_count; custom: manual entry)
5. **System creates** one `expenses` row and N `expense_shares` rows
6. **Each parent sees** their share appear in "My Expenses" with pending status

### 7.1.2 Paying an Expense Share

```
Parent sees pending expense
    ├── "Pay by Card" → Supabase Edge Function → Stripe Checkout Session → redirect to Stripe → webhook updates status to 'paid'
    ├── "Pay by ACH" → Same flow with ACH payment method
    ├── "Pay via Venmo" → Parent marks as paid with Venmo method → Manager verifies
    └── "Cash/Check" → Manager manually marks as paid with notes
```

### 7.1.3 Stripe Connect Setup

1. Manager clicks "Set Up Payment Account" in Expenses > Payment Setup
2. `create-connect-account` Edge Function creates a Stripe Connect Standard account
3. Manager is redirected to Stripe's hosted onboarding
4. On completion, `connected_accounts` record is created/updated
5. Status tracking: `onboarding_complete`, `charges_enabled`, `payouts_enabled`
6. Subsequent payments from parents route through Connect, with funds going to manager's connected account

## 7.2 Trip Planning Flow

### 7.2.1 Current State (Demo Mode)

1. Manager creates trip (name, destination, dates)
2. Manager clicks "Plan Trip" on any upcoming trip
3. Trip Planner opens with tabs: Flights, Hotels, Things to Do, Dining
4. **All data is mock** (generated from `mock-travel-data.ts`)
5. Flight results show airline, flight number, times, duration, stops, price, seats left
6. Hotel results show name, rating, price/night, distance from venue, team discount, amenities, family-friendly indicator
7. Attractions filter by age group (U8-U18)
8. Restaurants show group-friendly and kids menu badges
9. "Select" buttons are disabled with "Demo Mode - Real APIs coming soon" badge

### 7.2.2 Future State (Production)

1. Manager creates trip and enters destination + dates
2. System queries airline APIs (group booking) showing real prices and availability
3. System queries hotel APIs showing room blocks with team discount rates
4. Manager selects options, and the system generates a per-player cost estimate
5. System creates expense records automatically from booked items
6. Parents receive notification with trip cost breakdown and RSVP request

## 7.3 Dashboard Data Flow

```
Dashboard Load
    ├── useAuth() → Check session, fetch profile + roles
    ├── useTeam() → Load all user's teams, auto-select first (or saved from localStorage)
    ├── If club_admin → ClubExecutiveDashboard
    │   └── useClubStatistics() → Aggregate across all clubs/teams:
    │       ├── Total clubs, teams, players (adult + child)
    │       ├── Revenue collected (sum of paid expense_shares)
    │       ├── Pending payments (sum of pending expense_shares)
    │       └── Upcoming trips count
    └── Static cards: My Teams count, Upcoming Events count, Amount Due
```

---

# 8. API DOCUMENTATION

## 8.1 Supabase Client API (Frontend → Database)

All database operations use the Supabase JS client with Row-Level Security. The client is initialized in `src/integrations/supabase/client.ts`.

### 8.1.1 Authentication API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `supabase.auth.signUp()` | POST /auth/v1/signup | Register new user with email/password |
| `supabase.auth.signInWithPassword()` | POST /auth/v1/token | Login with email/password |
| `supabase.auth.signOut()` | POST /auth/v1/logout | End session |
| `supabase.auth.getSession()` | GET /auth/v1/session | Get current session |
| `supabase.auth.onAuthStateChange()` | WebSocket | Listen for auth state changes |

### 8.1.2 Data API Pattern

All data operations follow the same Supabase PostgREST pattern:

```typescript
// READ (with filtering)
supabase.from('table').select('*').eq('column', value).order('created_at', { ascending: false })

// CREATE
supabase.from('table').insert({ ...data }).select().single()

// UPDATE
supabase.from('table').update({ ...changes }).eq('id', recordId)

// DELETE
supabase.from('table').delete().eq('id', recordId)

// JOIN (via PostgREST embedding)
supabase.from('expense_shares').select('*, expense:expenses(*)')
```

### 8.1.3 Edge Functions (Serverless API)

| Function | Method | Purpose | Request Body |
|----------|--------|---------|-------------|
| `check-connect-status` | POST | Check Stripe Connect account status | None (uses auth token) |
| `create-connect-account` | POST | Create Stripe Connect account and generate onboarding link | `{ clubId?, teamId? }` |
| `create-expense-payment` | POST | Create Stripe Checkout Session for expense share payment | `{ expenseShareId, paymentMethod }` |

### 8.1.4 Real-Time Subscriptions (Future)

```typescript
// Subscribe to expense share updates for real-time payment tracking
supabase.channel('expense-updates')
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'expense_shares' }, handler)
  .subscribe()
```

---

# 9. COMPETITIVE LANDSCAPE & GAP ANALYSIS

## 9.1 Competitor Feature Matrix

| Feature | Champions | Snap!Spend | TeamSnap | SportsEngine | PlayMetrics | WeTravel |
|---------|-----------|------------|----------|--------------|-------------|----------|
| **Club hierarchy** | Yes | Yes | Yes (ONE) | Yes | Yes | No |
| **Roster management** | Yes | Limited | Yes | Yes | Yes | No |
| **Team scheduling** | Yes | No | Yes | Yes | Yes | No |
| **Attendance tracking** | Yes | No | Yes | Limited | Limited | No |
| **Expense management** | **Yes** | **Yes** | No | No | Limited | No |
| **Expense splitting** | **Yes** | **Yes** | No | No | No | **Yes** |
| **Payment collection** | Yes | Yes | Yes | Yes | Yes | Yes |
| **Stripe Connect** | **Yes** | Custom banking | Stripe | PowerPay | Custom | Stripe |
| **Trip planning** | **Yes** | No | No | No | No | **Yes** |
| **Travel booking** | Demo | No | No | No | No | **Yes** |
| **Itinerary builder** | **Yes** | No | No | No | No | **Yes** |
| **Team messaging** | Yes | No | Yes | Yes | Yes | No |
| **Player stats** | Yes | No | Limited | Limited | Limited | No |
| **College recruiting** | **Yes (AI)** | No | No | No | No | No |
| **Video management** | Yes | No | Yes | No | No | No |
| **Club financials dashboard** | **Yes** | **Yes** | Yes (ONE) | Yes | Yes | No |
| **Fundraising** | No | **Yes** | No | No | No | No |
| **Merch store** | No | **Yes** | **Yes** | No | No | No |
| **Mobile app** | Responsive | Yes | Yes | Yes | Yes | Yes |
| **Multi-sport** | Yes | Yes | Yes | Yes | Soccer-focused | Yes |
| **Receipt upload** | Schema only | Yes | No | No | No | No |
| **Installment payments** | No | Yes | No | No | No | **Yes** |

## 9.2 Competitor Pricing Summary

| Competitor | Model | Approximate Pricing |
|------------|-------|-------------------|
| **Snap!Spend** | Club license + transaction fees | Custom enterprise pricing; typically $2-5K/year per club + per-transaction fees |
| **TeamSnap** | Per-team or per-organization subscription | $9.99/mo (basic), $79.99/mo (standard), $499.99/mo (premium); TeamSnap ONE custom |
| **SportsEngine** | Tiered subscription + transaction fees | Free tier available; $79/mo or $799/yr for Express; premium tiers custom |
| **PlayMetrics** | Custom club pricing | Not published; enterprise sales model; estimated $3-10K/year per club |
| **WeTravel** | Free tier + paid tiers + transaction fees | Free base tier; paid plans with lower transaction fees; ~2.5% fee on free plan |

## 9.3 Gap Analysis: Customer Discovery Needs vs. Current Product

| Customer Need (from Discovery) | Current Status | Gap | Priority |
|-------------------------------|----------------|-----|----------|
| **Travel booking (flights, hotels, cars)** | Demo mode with mock data | **Critical Gap**: No real booking capability | P1 |
| **Automated name/DOB collection for group flights** | Child profiles have DOB; no flight integration | **Major Gap**: Need to pull from roster and submit to airline | P1 |
| **Upfront cost sharing / group payment for flights** | Expenses can be split; no booking integration | **Major Gap**: Can split after-the-fact but can't collect before booking | P1 |
| **Real-time expense tracking during trips** | Manual expense creation only | **Significant Gap**: No mobile-first receipt capture or real-time updates | P2 |
| **Receipt photo capture and storage** | Schema supports receipt_url; no upload UI | **Minor Gap**: Need file upload component | P2 |
| **Cancellation handling (non-refundable tickets)** | No cancellation policy logic | **Major Gap**: Need rules engine for cost redistribution | P2 |
| **Coach/chaperone per diem management** | No per diem concept | **Moderate Gap**: Need per diem rules, tracking, and approval | P2 |
| **Integration with PlayMetrics/SportsEngine** | No integrations | **Moderate Gap**: Reduces manual data entry | P3 |
| **Push notifications** | Not built | **Significant Gap**: Critical for parent engagement | P1 |
| **Native mobile app** | Responsive web only | **Significant Gap**: Parents expect app store experience | P2 |
| **Parent RSVP for trips** | No RSVP system | **Moderate Gap**: Need confirmation + headcount tracking | P1 |
| **Automated payment reminders** | No reminders | **Significant Gap**: #1 pain point is chasing payments | P1 |
| **Expense report generation (PDF/CSV)** | Not built | **Minor Gap**: Nice-to-have for year-end tax documentation | P2 |
| **Fundraising tools** | Not built | **Moderate Gap**: Snap!Spend differentiator; clubs value this | P3 |
| **Club-wide expense policies** | Not built | **Minor Gap**: Per diem rates, approved vendors | P2 |

## 9.4 Competitive Differentiation Strategy

### Where Champions Wins
1. **Travel + Expense in one platform**: No competitor does both well. WeTravel handles group travel but isn't built for sports. Snap!Spend handles expenses but has zero travel features. Champions bridges this gap.
2. **AI-powered recruiting tools**: Unique differentiator that no team management platform offers.
3. **Modern tech stack**: Built on React/Supabase vs. legacy platforms (SportsEngine on Rails, older architectures). Faster iteration, better UX.
4. **Parent-first UX**: Designed for the parent experience, not just the admin.
5. **Transparent expense splitting**: Real-time visibility into what you owe and why.

### Where Champions Must Improve
1. **No native mobile app** (all competitors have one)
2. **No real travel booking** (core value prop is demo-only)
3. **No push notifications** (critical for engagement)
4. **No automated payment reminders** (the #1 pain point)
5. **No fundraising tools** (Snap!Spend moat)

---

# 10. REVENUE MODEL ANALYSIS

## 10.1 Model A: Club License (B2B SaaS)

**Description**: The club (or school athletic department) pays an annual or monthly subscription fee. Parents use the platform for free.

| Component | Pricing | Notes |
|-----------|---------|-------|
| Base platform fee | $200-500/month or $2,000-5,000/year per club | Scales with team count |
| Per-team add-on | $25-50/month per team beyond included count | 3-5 teams included in base |
| Transaction fee | 2.9% + $0.30 passed to payer | Stripe fee passthrough; no additional margin |
| Premium add-ons | $50-100/month | Travel booking, AI recruiting tools |

**Revenue projection (Year 1)**:
- 20 clubs at $300/mo avg = $72,000 ARR
- Plus transaction volume (assume $500K processed at 0.5% platform margin) = $2,500
- **Total Year 1: ~$75K ARR**

**Pros**: Predictable revenue; club decision-maker buys once; all teams onboard; lower parent friction.
**Cons**: Longer sales cycle; enterprise sales required; lower initial revenue per user.

## 10.2 Model B: Freemium Parent App with Premium Features

**Description**: Parents can use core features free. Premium features (AI recruiting, advanced expense reports, photo gallery) require individual subscription.

| Component | Pricing | Notes |
|-----------|---------|-------|
| Free tier | $0 | Schedule view, basic expense tracking, messaging |
| Premium parent | $4.99-9.99/month | Advanced features, AI recruiting, priority support |
| Transaction fee | 2.9% + $0.30 + 1% platform fee | Parents pay platform fee on top of Stripe fee |
| One-time purchases | $9.99-29.99 | AI Video Clip Advisor, recruiting guides |

**Revenue projection (Year 1)**:
- 50 teams x 18 families = 900 parents
- 15% convert to premium at $7/mo = 135 x $7 x 12 = $11,340
- Transaction volume ($300K at 1% margin) = $3,000
- AI recruiting purchases (100 at $19.99) = $1,999
- **Total Year 1: ~$16K ARR**

**Pros**: Easy user acquisition; no enterprise sales needed; viral team-to-team spread.
**Cons**: Low ARPU; hard to reach meaningful revenue; parents resist another subscription.

## 10.3 Model C: Hybrid Club Platform + Parent Marketplace

**Description**: Clubs pay a modest subscription for team management. Parents pay transaction fees on payments and access a marketplace of add-on services (recruiting, travel booking commissions).

| Component | Pricing | Notes |
|-----------|---------|-------|
| Club subscription | $99-199/month per club | Includes all teams; lower bar than Model A |
| Transaction fee | 2.9% + $0.30 + 1.5% platform fee | Platform takes margin on all payment processing |
| Travel booking commissions | 5-10% of booked travel | Affiliate/commission on flights, hotels, cars |
| AI recruiting | $19.99 one-time or $4.99/mo | Paid add-on for parents |
| Sponsorship/advertising | $500-2000/mo per club | Local business ads shown to parents |

**Revenue projection (Year 1)**:
- 30 clubs at $149/mo = $53,640 ARR
- Transaction volume ($750K at 1.5% margin) = $11,250
- Travel booking commissions ($200K booked at 7%) = $14,000
- AI recruiting (200 purchases at $19.99) = $3,998
- **Total Year 1: ~$83K ARR**

**Pros**: Multiple revenue streams; travel commissions align with core value prop; moderate club price point.
**Cons**: Complex business model; travel commissions require booking integrations.

## 10.4 Recommended Revenue Model: "The Platform Play"

After deep analysis, the **optimal revenue model** is a modified version of Model C, but with a critical strategic shift:

### The Recommended Model: **Transaction-Centric Platform with Club Onramp**

| Component | Pricing | Rationale |
|-----------|---------|-----------|
| **Free club tier** | $0 | Remove ALL friction from club onboarding. Let clubs try the platform with no risk. |
| **Platform transaction fee** | 3.5% on all money processed (includes Stripe's 2.9%+$0.30; platform keeps ~0.3-0.5% net) | This is where the real money is. Youth sports teams process $20K-100K+ per year per team in travel expenses, tournament fees, and dues. |
| **Travel booking margin** | 8-12% commission on booked travel | This is the strategic differentiator. If Champions becomes the booking platform, the volume is massive. |
| **Premium club tier** | $99/month | Advanced reporting, API integrations, priority support, white-label options |
| **AI add-ons** | $19.99 per use or $9.99/month | Recruiting tools, budget estimation, itinerary suggestions |
| **Instant payout fee** | 1% of payout amount | Managers who want next-day payouts instead of standard 2-3 day |

### Why This Is Best:

1. **Zero-friction onboarding**: Free tier eliminates the "convince the club COO" bottleneck. Any team manager or parent can start using it immediately.
2. **Revenue scales with usage**: The more teams travel, the more revenue Champions earns. This perfectly aligns incentives -- Champions is motivated to make trip planning easier.
3. **Massive TAM per team**: A single team traveling 4 times per year at $800/player x 18 players = $57,600 in annual trip spend. At 3.5% platform fee = $2,016 per team per year just from transaction fees.
4. **Travel commissions are the unlock**: If Champions can book $5M in travel in Year 2 at 10% commission = $500K. This is the path to a venture-scale business.
5. **Network effects**: Once a club's parents are on the platform, other teams at the same club adopt. Once a club is on, other clubs in the same league notice.

### Revenue Projection (Recommended Model)

| Year | Teams | Transaction Volume | Platform Fee Rev | Travel Commissions | Premium Clubs | AI Add-ons | Total ARR |
|------|-------|-------------------|------------------|--------------------|---------------|------------|-----------|
| Y1 | 100 | $2M | $60K | $0 (building) | $12K (10 clubs) | $5K | **$77K** |
| Y2 | 500 | $15M | $450K | $200K | $72K (60 clubs) | $30K | **$752K** |
| Y3 | 2,000 | $80M | $2.4M | $1.5M | $240K (200 clubs) | $120K | **$4.26M** |

---

# 11. COST ESTIMATION

## 11.1 Infrastructure Costs (Monthly)

| Service | Launch (10 clubs) | Growth (100 clubs) | Scale (1,000 clubs) |
|---------|-------------------|--------------------|--------------------|
| Supabase (DB, Auth, Functions) | $25 (Pro) | $110 (Large) | $599 (Team) |
| Hosting (Vercel/Netlify) | $0 (free) | $20 | $150 |
| Domain & DNS | $1 | $1 | $5 |
| Email (SendGrid/Resend) | $0 (free tier) | $20 | $90 |
| Error Monitoring (Sentry) | $0 (free) | $26 | $80 |
| Analytics (PostHog) | $0 (free) | $0 | $450 |
| CDN & Storage overages | $0 | $10 | $100 |
| **Total Infrastructure** | **$26/mo** | **$187/mo** | **$1,474/mo** |

## 11.2 Third-Party Service Costs

| Service | Cost | Notes |
|---------|------|-------|
| Stripe processing | 2.9% + $0.30/txn | Passed through to users |
| Stripe Connect platform fee | $2/active account/mo | Charged per connected account |
| Travel API subscriptions | $200-500/mo | Amadeus, hotel APIs (when built) |
| AI/LLM API (recruiting tools) | $50-200/mo | OpenAI/Anthropic API costs |
| Apple Developer Program | $99/year | For iOS app |
| Google Play Developer | $25 one-time | For Android app |

## 11.3 People Costs (Team)

| Role | Status | Estimated Cost |
|------|--------|---------------|
| Founding engineers (2) | Cofounders / equity | $0 cash initially |
| Designer / UX | Contract | $5K-10K for MVP polish |
| Marketing / Growth | Part-time contractor | $2K-5K/mo |
| Customer success | Founder-led initially | $0 initially |
| Legal (incorporation, terms, privacy) | One-time + ongoing | $3K-5K initial; $500/mo ongoing |
| Accounting / Bookkeeping | Contractor | $300-500/mo |

## 11.4 Total Monthly Burn Rate Estimates

| Phase | Timeline | Monthly Burn | Notes |
|-------|----------|-------------|-------|
| Pre-revenue | Now - Q3 2026 | $3K-5K/mo | Infrastructure + design contract |
| Early revenue | Q3 2026 - Q1 2027 | $8K-12K/mo | Add marketing + legal |
| Growth | Q1 2027 - Q4 2027 | $15K-25K/mo | First hires, travel API costs |
| Scale | 2028+ | $40K-80K/mo | Full team, enterprise support |

## 11.5 Break-Even Analysis

With the recommended revenue model (transaction-centric):
- **Monthly fixed costs at growth stage**: ~$15K/mo
- **Revenue per team**: ~$168/mo average (transaction fees on $5,600/mo spend)
- **Break-even**: ~90 active teams = ~15-20 clubs
- **Timeline to break-even**: Q4 2026 - Q1 2027 (aggressive) or Q2 2027 (conservative)

---

# 12. PRODUCTION PROJECT PLAN

## Phase 1: Production Readiness (Now - June 2026) -- 12 weeks

### Sprint 1-2: Foundation (Weeks 1-4)
- [ ] **Security hardening**: Complete RLS policies on all 24 tables
- [ ] **Environment setup**: Separate dev/staging/production Supabase projects
- [ ] **CI/CD pipeline**: GitHub Actions for lint, build, test, deploy
- [ ] **Custom domain**: Register and configure championsleagues.com (or .app)
- [ ] **Error monitoring**: Integrate Sentry for frontend and Edge Functions
- [ ] **Automated testing**: Unit tests for hooks, integration tests for critical flows (auth, expense creation, payment)
- [ ] **Remove console.log statements** from production code (Dashboard.tsx has debug logging)

### Sprint 3-4: Core Feature Completion (Weeks 5-8)
- [ ] **Push notifications**: Integrate web push (service worker) for expense reminders, new messages, trip updates
- [ ] **Email notifications**: Payment reminders, trip RSVP requests, new expense notifications via SendGrid/Resend
- [ ] **Receipt upload**: File upload component on expense creation, stored in Supabase Storage
- [ ] **Trip RSVP system**: Parent confirmation/decline for trips, headcount tracking
- [ ] **Automated payment reminders**: Scheduled Edge Function (cron) to send reminders for overdue expense shares
- [ ] **Expense report export**: PDF/CSV generation for managers and parents
- [ ] **Fix demo-team hardcoding**: Expenses page uses `currentTeamId = 'demo-team'` instead of actual team context

### Sprint 5-6: Polish & Launch Prep (Weeks 9-12)
- [ ] **Landing page optimization**: SEO, performance, social proof, demo video
- [ ] **Onboarding flow**: Guided first-run experience for club admins and parents
- [ ] **Legal**: Terms of Service, Privacy Policy, Cookie Policy
- [ ] **Stripe production mode**: Live API keys, webhook endpoints, tax reporting
- [ ] **Performance optimization**: Code splitting, lazy loading, image optimization
- [ ] **Accessibility audit**: WCAG 2.1 AA compliance
- [ ] **Load testing**: Verify 1,000 concurrent user capacity
- [ ] **Analytics**: PostHog/Mixpanel integration for product metrics

## Phase 2: Mobile & Engagement (July - October 2026) -- 16 weeks

### Sprint 7-10: Mobile App (Weeks 13-20)
- [ ] **React Native or Capacitor** wrapper for iOS and Android
- [ ] **Push notifications**: Native push via APNs and FCM
- [ ] **Offline support**: Cache critical data for spotty tournament WiFi
- [ ] **Camera integration**: Receipt photo capture
- [ ] **App store submission**: Apple App Store and Google Play

### Sprint 11-14: Engagement & Retention (Weeks 21-28)
- [ ] **OAuth login**: Google and Apple SSO
- [ ] **Invite system**: Email/SMS invites for parents to join teams
- [ ] **Real-time updates**: Supabase Realtime subscriptions for expense status changes
- [ ] **Photo gallery**: Team photo sharing with event associations
- [ ] **Installment payments**: Allow parents to pay in 2-4 installments
- [ ] **Club-wide expense policies**: Per diem rates, approved vendors, budget templates

## Phase 3: Travel Booking Integration (November 2026 - March 2027) -- 20 weeks

### Sprint 15-20: Real Travel Booking
- [ ] **Amadeus / Duffel API integration**: Real flight search for group bookings
- [ ] **Hotel API integration**: Room block search, negotiated rates
- [ ] **Car rental API**: Group vehicle booking
- [ ] **Automated roster-to-booking**: Pull names/DOBs from child_profiles for flight manifests
- [ ] **Pre-trip cost estimation**: AI-powered budget projection based on destination, team size, dates
- [ ] **Booking-to-expense automation**: Booked items automatically create expenses with per-player splits
- [ ] **Cancellation management**: Rules engine for handling dropouts, cost redistribution, refund processing

### Sprint 21-24: Advanced Features
- [ ] **Integration with PlayMetrics**: Roster sync API
- [ ] **Integration with SportsEngine**: Schedule import
- [ ] **Fundraising module**: Basic fundraising page creation and collection
- [ ] **Sponsorship platform**: Local business advertising to team parents
- [ ] **AI budget advisor**: ML model trained on historical trip costs for accurate pre-trip estimates
- [ ] **White-label option**: Custom branding for large clubs

## Phase 4: Scale & Enterprise (2027+)
- [ ] **Enterprise sales team**: Dedicated account managers for large clubs
- [ ] **Multi-tenancy**: Isolated environments for enterprise clubs
- [ ] **Advanced analytics**: BI dashboard for club operations
- [ ] **API marketplace**: Third-party integrations and plugins
- [ ] **International expansion**: Currency support, localization

## 12.1 Key Milestones

| Milestone | Target Date | Success Criteria |
|-----------|------------|------------------|
| Production launch (V1) | June 15, 2026 | Deployed on custom domain with Stripe live, 3 pilot clubs onboarded |
| First revenue | July 2026 | First transaction processed through platform |
| 10 paying clubs | September 2026 | 10 clubs with active teams using the platform |
| Mobile app launch | October 2026 | iOS and Android apps in stores |
| Travel booking beta | January 2027 | Real flight search working for 5 beta clubs |
| $10K MRR | March 2027 | Sustained monthly recurring revenue |
| 100 clubs | June 2027 | Expansion beyond initial markets |

---

# 13. CUSTOMER DEMO STRATEGY

## 13.1 Demo Narrative (30-Minute Script)

### Act 1: The Problem (5 minutes)
- Open with the "spreadsheet from hell" - show a typical team travel expense spreadsheet
- Highlight the pain points: manual data entry, missing receipts, payment chasing, parent disputes
- Reference customer discovery insights: "We talked to club COOs who told us their coaches spend 15-20 hours per trip on administration instead of coaching"

### Act 2: The Platform Tour (15 minutes)

**Scene 1: Club Admin View**
- Show club creation flow
- Demonstrate club executive dashboard with multi-team financial overview
- Highlight aggregate stats: total players, revenue collected, pending payments

**Scene 2: Team Manager Trip Flow**
- Create a trip (e.g., "Phoenix Cup Tournament")
- Show trip planner with flight/hotel/dining recommendations
- Create an expense and split it among team families
- Show the manager's view of payment status

**Scene 3: Parent Experience**
- Switch to parent login
- Show "My Expenses" with clear amount due
- Demonstrate payment via Stripe (card/ACH) and Venmo marking
- Show payment history and receipt

**Scene 4: Recruiting Bonus (if time)**
- Demo the AI Video Clip Advisor
- Show how it provides sport-specific guidance on creating recruiting highlights

### Act 3: The Roadmap (5 minutes)
- Real travel booking (flights, hotels, cars) coming Q1 2027
- Native mobile app coming Q4 2026
- Integration with PlayMetrics and SportsEngine for roster sync
- Automated payment reminders and push notifications

### Act 4: Next Steps (5 minutes)
- Pilot program offer: Free for first 3 months for founding clubs
- Ask for introductions to 2-3 other clubs
- Schedule follow-up with team managers for hands-on onboarding

## 13.2 Demo Environments

| Environment | Purpose | Data |
|-------------|---------|------|
| **Live demo account** | Pre-configured with realistic data | 2 clubs, 4 teams, 60 players, 10 trips, 50 expenses |
| **Sandbox** | For prospects to try themselves | Empty account they can populate |
| **Video walkthrough** | Self-service for prospects not ready for live demo | 5-minute Loom video on website |

## 13.3 Target Demo Prospects (from Customer Discovery)

| Club | Location | Contact Point | Status |
|------|----------|--------------|--------|
| Albion SC | Colorado | Zac (COO) | Adrian setting up meeting |
| Broomfield Soccer | Colorado | TBD | On list |
| Winter Park Comp Center | Colorado | TBD | On list |
| Rapids Youth Soccer | Colorado | TBD | On list |
| Other sports (hockey, baseball, volleyball, lacrosse parents/coaches) | Colorado | TBD | On list |

## 13.4 Key Demo Talking Points

1. **"We save your team coordinator 15+ hours per trip"** - Position around time savings
2. **"Every parent sees exactly what they owe and why"** - Transparency builds trust
3. **"No more fronting thousands on your personal credit card"** - Pain point resonance
4. **"Works alongside your existing tools"** - Not a rip-and-replace; import schedules, sync rosters (future)
5. **"Built by parents who've been through this"** - Credibility and empathy

---

# APPENDIX A: Technology Decision Log

| Decision | Options Considered | Choice | Rationale |
|----------|-------------------|--------|-----------|
| Backend | Firebase, Supabase, Custom API | Supabase | PostgreSQL (relational), built-in auth, real-time, Edge Functions, generous free tier, rapid development |
| Frontend | Next.js, Remix, Vite+React | Vite+React | SPA is sufficient for MVP; faster build times; Lovable scaffolding support |
| Payments | Stripe, Square, PayPal | Stripe Connect | Industry standard; marketplace model support; ACH + card; excellent docs |
| UI | Material UI, Chakra, shadcn | shadcn/ui | Accessible Radix primitives; copy-paste customization; Tailwind-native |
| Hosting | AWS, Vercel, Netlify, Lovable | Lovable (current) | Rapid deployment during prototyping; will migrate to Vercel for production |

# APPENDIX B: Glossary

| Term | Definition |
|------|-----------|
| **Club** | A sports organization (e.g., "Albion SC") that contains multiple teams |
| **Team** | A group of players within a club, typically defined by age group and gender (e.g., "U14 Boys") |
| **Team Manager** | A coach or parent volunteer who administers a specific team |
| **Club Admin** | An administrator with oversight across all teams in a club |
| **Expense Share** | An individual parent's portion of a team expense |
| **Connected Account** | A Stripe Connect account set up by a team manager to receive payments |
| **Trip Itinerary** | The detailed schedule of activities, travel, and logistics for a team trip |
| **RSVP** | A parent's confirmation of their child's participation in a trip |
| **Per Diem** | A daily allowance for coaches/chaperones to cover meals and incidentals during travel |
| **RLS** | Row-Level Security -- PostgreSQL policies that restrict data access based on user identity |

---

*Document prepared March 7, 2026. This is a living document and should be updated as the product evolves.*
