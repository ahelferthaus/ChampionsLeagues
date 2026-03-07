# Champions Platform — Complete Business & Technical Specification

**Version:** 1.0  
**Date:** March 7, 2026  
**Authors:** Champions Development Team  
**Status:** Pre-Production / MVP  

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
9. [Competitive Analysis](#9-competitive-analysis)
10. [Customer Discovery Alignment](#10-customer-discovery-alignment)
11. [Gap Analysis & Feature Roadmap](#11-gap-analysis--feature-roadmap)
12. [Production Readiness Plan](#12-production-readiness-plan)
13. [Appendices](#13-appendices)

---

# 1. EXECUTIVE SUMMARY

## 1.1 Product Vision

Champions is an all-in-one youth sports team management platform designed to solve the operational chaos that coaches, parents, and club administrators face daily — particularly around travel coordination, expense management, team scheduling, and communication. The platform bridges a critical gap in the market: while existing tools handle scheduling or basic payments, none holistically address the end-to-end complexity of team travel, real-time expense tracking, and transparent financial management.

## 1.2 Problem Statement

Youth sports clubs across the United States — spanning soccer, basketball, hockey, baseball, lacrosse, volleyball, and more — manage thousands of teams that travel to out-of-state tournaments and competitions. This travel involves:

- **Tournament fees** ($200–$2,000+ per team)
- **Group flights** ($300–$800 per person, requiring government IDs, coordinated booking)
- **Hotel blocks** ($150–$300/night per room, 3–7 nights)
- **Car rentals** ($50–$150/day, shared across families)
- **Food and incidentals** ($30–$75/day per person)
- **Coach and chaperone expenses** (per diems, travel costs, who pays?)

Today, teams rely on spreadsheets, Venmo requests, group texts, and volunteer parents to manage this. The result is:

- **Financial opacity**: Parents don't trust the numbers
- **Volunteer burnout**: Nobody wants to be the team treasurer
- **Booking chaos**: Last-minute cancellations, non-refundable tickets, name-change fees
- **Errors**: Manual spreadsheets inevitably contain mistakes
- **Time sink**: Coordinators spend 10–20+ hours per trip on logistics

## 1.3 Market Opportunity

- **Youth Sports Software Market**: Valued at $2.8B in 2025, projected to reach $5.4B by 2033 (CAGR ~8.5%)
- **U.S. Youth Soccer alone**: ~6,000 clubs, ~10,000+ travel-competitive teams
- **ECNL/ECRL**: 519+ clubs (266 boys, 253 girls) with mandatory out-of-state travel
- **Multi-sport opportunity**: Basketball (AAU), Baseball (Perfect Game/USSSA), Hockey (AAA Tier 1), Volleyball (USAV), Lacrosse (NLF), Swimming, Tennis, Wrestling, Gymnastics
- **TAM estimate**: 50,000+ travel teams × $500–$2,000/year platform fee = $25M–$100M+ TAM

## 1.4 Current State

Champions is in **MVP/pre-production** stage with the following implemented:

| Module | Status | Notes |
|--------|--------|-------|
| Authentication | ✅ Working | Email/password with role-based access |
| Club & Team Creation | ✅ Working | Full hierarchy: League → Club → Team |
| Dashboard | ⚠️ Partial | Cards show hardcoded zeros instead of live data |
| Schedule/Events | ⚠️ Partial | DB-backed but not wired to selected team context |
| Roster Management | ⚠️ Partial | Uses demo data instead of live DB |
| Trip Planning | ⚠️ Partial | DB-backed but not fully wired to team context |
| Expense Management | ✅ Working | Full Stripe Connect Express integration |
| Payments | ⚠️ Partial | DB-backed but uses demo data triggers |
| Attendance Tracking | ⚠️ Partial | DB-backed, needs team context wiring |
| Team Stats | ⚠️ Partial | Uses demo data |
| Messaging | ⚠️ Partial | DB-backed with email notifications |
| Video/Recruiting | ⚠️ Partial | AI video clip advisor works, video links table exists |
| Resources | ⚠️ Partial | DB-backed, needs team context |
| Profile Management | ✅ Working | Full CRUD with sport preferences |

---

# 2. BUSINESS REQUIREMENTS DOCUMENT (BRD)

## 2.1 Business Objectives

| # | Objective | Success Metric | Priority |
|---|-----------|---------------|----------|
| BO-1 | Reduce time spent managing team travel logistics | 75% reduction in coordinator hours per trip (from 20hrs to 5hrs) | Critical |
| BO-2 | Provide transparent, real-time financial visibility to all stakeholders | 100% of expenses visible to parents within 24 hours of incurrence | Critical |
| BO-3 | Eliminate spreadsheet-based financial tracking | 0 external spreadsheets needed for trip management | High |
| BO-4 | Reduce payment collection friction | 90%+ on-time payment rate via integrated payment methods | High |
| BO-5 | Enable club-level operational oversight | Club admins can view aggregate financials across all teams | High |
| BO-6 | Support multi-sport, multi-team families | Single parent account manages multiple children across teams | Medium |
| BO-7 | Provide college recruiting support tools | Athletes have tools to create and share recruiting videos | Medium |
| BO-8 | Replace point solutions with a unified platform | One platform replaces TeamSnap + Snap!Spend + spreadsheets | Strategic |

## 2.2 Stakeholder Analysis

### Primary Stakeholders

| Stakeholder | Role | Pain Points | Key Needs |
|-------------|------|-------------|-----------|
| **Club Administrator (COO/Director)** | Oversees entire club operations, 10–50+ teams | No visibility into team finances, can't standardize processes, spends time answering parent complaints | Club-wide financial dashboards, standardized trip processes, audit trails |
| **Team Manager / Head Coach** | Manages day-to-day team operations | Spending personal time on logistics instead of coaching, fronting thousands on credit cards, chasing parents for payments | Easy expense tracking, automated payment collection, trip planning tools |
| **Parent / Guardian** | Pays for child's participation, may volunteer | Doesn't trust the spreadsheet, unclear what they owe, frustrated by last-minute payment requests, different payment methods per team | Transparent cost breakdowns, flexible payment methods (card, ACH, Venmo), clear invoicing |
| **Player (minor)** | Participates in events and travel | N/A (represented by parent) | View schedule, team roster, highlights |
| **Travel Coordinator (Volunteer)** | Books travel for the team | Extremely time-consuming process, personal financial risk, no tools, no recognition | Booking tools, cost calculators, reimbursement workflows |

### Secondary Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| League/Association | Standardized data formats, compliance reporting |
| Tournament Organizers | Registration integration, team verification |
| Travel Vendors (Hotels, Airlines) | Group booking integrations |
| Insurance Providers | Participant medical info, waivers |

## 2.3 Business Rules

| Rule ID | Rule | Rationale |
|---------|------|-----------|
| BR-1 | Only parents (adults 18+) can create accounts. Players cannot self-register. | COPPA compliance for minors |
| BR-2 | Club admins and team managers are the only roles that can be elevated; parents can self-assign. | Prevent privilege escalation |
| BR-3 | Financial data (expenses, payments) must be visible to all team members but only editable by managers. | Transparency with access control |
| BR-4 | Payment processing must support ACH (lowest cost), credit/debit card, and Venmo. | Parent preference and cost optimization |
| BR-5 | Zero platform fee on internal fund transfers between team members. | Competitive advantage over Snap!Spend (which charges 4.5% on card payments) |
| BR-6 | Medical information (allergies, emergency contacts) must be restricted to parent-only access. | HIPAA-adjacent privacy protection |
| BR-7 | All financial transactions must maintain an immutable audit trail. | Trust, compliance, dispute resolution |
| BR-8 | Managers who front expenses must have a clear reimbursement workflow. | Key pain point from customer discovery |

## 2.4 Revenue Model

| Revenue Stream | Pricing Model | Notes |
|----------------|--------------|-------|
| **Club Subscription** | $500–$2,000/year per club (tiered by team count) | Primary revenue; enterprise sales |
| **Team Subscription** | $15–$25/month per team (self-serve) | Bottoms-up adoption |
| **Payment Processing** | Pass-through Stripe fees (2.9% + $0.30 card; 0.8% ACH capped at $5) | No platform markup; cost advantage |
| **Premium Features** | $5–$10/month add-ons (video analysis, advanced analytics) | Future upsell |
| **Travel Partnerships** | Referral fees from hotel/airline group booking partners | Phase 3+ |

## 2.5 Constraints & Assumptions

**Constraints:**
- Must operate within Stripe Connect Express limitations
- Cannot directly access airline/hotel booking APIs without partnership agreements
- Must comply with COPPA (Children's Online Privacy Protection Act)
- Mobile-responsive web app first; native mobile apps are Phase 3+

**Assumptions:**
- Clubs will adopt at the organizational level (top-down sales motion)
- Parents prefer paying via ACH/bank transfer to minimize fees
- Coaches want to spend zero time on financial administration
- Existing tools (TeamSnap, Snap!Spend) will not rapidly add travel management features

---

# 3. FUNCTIONAL REQUIREMENTS DOCUMENT (FRD)

## 3.1 Authentication & Authorization

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| AUTH-1 | The system must support email/password registration with email verification | Critical | ✅ Implemented |
| AUTH-2 | The system must support four user roles: club_admin, team_manager, parent, player | Critical | ✅ Implemented |
| AUTH-3 | Only the "parent" role can be self-assigned during registration | Critical | ✅ Implemented |
| AUTH-4 | Club admins can assign team_manager and club_admin roles | Critical | ✅ Implemented |
| AUTH-5 | The system must maintain separate user_roles table (not on profiles) to prevent privilege escalation | Critical | ✅ Implemented |
| AUTH-6 | Session persistence across browser restarts | High | ✅ Implemented |
| AUTH-7 | The system should support Google OAuth sign-in | Medium | ❌ Not implemented |
| AUTH-8 | The system should support "magic link" passwordless login | Low | ❌ Not implemented |

## 3.2 Club & Team Management

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| CLUB-1 | Club admins can create clubs with name, description, logo, and brand colors | Critical | ✅ Implemented |
| CLUB-2 | Club admins can create teams under a club with sport, age group, and gender | Critical | ✅ Implemented |
| CLUB-3 | Team managers can add/remove team members (parents and players) | Critical | ✅ Implemented |
| CLUB-4 | The system must support child profiles linked to parent accounts | Critical | ✅ Implemented |
| CLUB-5 | Team members can view their team roster with names and positions | High | ⚠️ Uses demo data |
| CLUB-6 | Users can belong to multiple teams across multiple clubs | High | ✅ Implemented |
| CLUB-7 | Club admins can view all teams and aggregate club data | High | ⚠️ Partial |
| CLUB-8 | The team switcher in navigation must allow switching between teams | High | ✅ Implemented |
| CLUB-9 | The system should support league/association hierarchies above clubs | Low | ✅ Schema exists |

## 3.3 Schedule & Event Management

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| SCHED-1 | Managers can create events with type (practice, game, tournament, meeting), date/time, location | Critical | ✅ Implemented |
| SCHED-2 | Events display in a calendar view (month/week/day) | Critical | ✅ Implemented |
| SCHED-3 | Game events support opponent name and home/away designation | High | ✅ Implemented |
| SCHED-4 | The system must support schedule import from external sources (CSV, iCal) | High | ⚠️ Partial (import dialog exists) |
| SCHED-5 | Events can be exported to Google Calendar, Apple Calendar, Outlook | High | ✅ Implemented (iCal export) |
| SCHED-6 | The system should send email reminders before events | Medium | ✅ Implemented (send-email edge function) |
| SCHED-7 | Events must be scoped to the currently selected team | Critical | ⚠️ Needs team context wiring |

## 3.4 Attendance Tracking

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| ATT-1 | Managers can mark attendance for each team member at each event | Critical | ✅ Implemented |
| ATT-2 | Attendance status options: present, absent, late, excused | High | ✅ Implemented |
| ATT-3 | Parents can view their child's attendance history | High | ✅ Implemented |
| ATT-4 | Managers can view aggregate attendance reports | Medium | ⚠️ Partial |
| ATT-5 | The system should support RSVP before events | Medium | ❌ Not implemented |

## 3.5 Financial Management — Expenses

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| EXP-1 | Managers can create expenses with title, amount, category, due date, and description | Critical | ✅ Implemented |
| EXP-2 | Expenses can be split equally across team members or assigned custom amounts | Critical | ✅ Implemented |
| EXP-3 | Each team member's share is tracked individually with status (pending, paid, overdue, cancelled) | Critical | ✅ Implemented |
| EXP-4 | Team members can pay their share via Stripe Checkout (card or ACH) | Critical | ✅ Implemented |
| EXP-5 | Payments are transferred directly to the manager's Stripe Connect Express account (zero platform fee) | Critical | ✅ Implemented |
| EXP-6 | Managers must complete Stripe Connect onboarding before receiving payments | Critical | ✅ Implemented |
| EXP-7 | Expense categories: trip, equipment, registration, uniform, fundraiser, other | High | ✅ Implemented |
| EXP-8 | The system should support receipt upload and storage | Medium | ⚠️ Schema exists, UI partial |
| EXP-9 | The system should support manager reimbursement requests (manager fronts expense, team pays them back) | High | ⚠️ Supported by architecture, workflow not explicit in UI |
| EXP-10 | Venmo integration for peer-to-peer payments | High | ⚠️ Venmo handle stored in profiles, deep-link not implemented |

## 3.6 Financial Management — Payments

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| PAY-1 | Managers can create payment requests for team fees (season dues, tournament fees, etc.) | Critical | ✅ Implemented |
| PAY-2 | Parents see their pending payments with amount due and due date | Critical | ✅ Implemented |
| PAY-3 | Managers can mark payments as paid (for offline payments) | High | ✅ Implemented |
| PAY-4 | Payment history is maintained for all transactions | High | ✅ Implemented |
| PAY-5 | The system should support recurring/installment payments | Medium | ❌ Not implemented |
| PAY-6 | The system should support auto-pay authorization | Medium | ❌ Not implemented |
| PAY-7 | Overdue payments should be flagged and parents notified | Medium | ⚠️ Status tracking exists, notifications not automated |

## 3.7 Trip Planning & Travel Management

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| TRIP-1 | Managers can create trips with destination, departure/return dates, meeting location, and notes | Critical | ✅ Implemented |
| TRIP-2 | Trips support a detailed itinerary with multiple items (travel, lodging, meals, activities, games) | Critical | ✅ Implemented |
| TRIP-3 | Itinerary items have time, location, cost estimate, booking URL, and booking reference | High | ✅ Implemented |
| TRIP-4 | Itinerary items can be tagged to specific age groups | High | ✅ Implemented |
| TRIP-5 | Team members can view trip details and itinerary | Critical | ✅ Implemented |
| TRIP-6 | The system should support trip RSVP / commitment tracking | High | ❌ Not implemented |
| TRIP-7 | The system should calculate and display total trip cost per player | High | ❌ Not implemented |
| TRIP-8 | The system should support packing lists | Low | ❌ Not implemented |
| TRIP-9 | The system should integrate with travel booking services (hotels, flights) | Strategic | ❌ Phase 3 |
| TRIP-10 | Trip expenses should link to the expense management module | High | ⚠️ Architecture supports it |

## 3.8 Communication & Messaging

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| MSG-1 | Managers can send messages to the entire team | Critical | ✅ Implemented |
| MSG-2 | Messages are stored and viewable in the app | High | ✅ Implemented |
| MSG-3 | The system sends email notifications for messages | High | ✅ Implemented (Resend API) |
| MSG-4 | Message recipients are tracked (read/unread status) | High | ✅ Implemented |
| MSG-5 | The system should support push notifications | Medium | ❌ Not implemented |
| MSG-6 | The system should support direct messages between team members | Medium | ❌ Not implemented |
| MSG-7 | The system should support file attachments in messages | Low | ❌ Not implemented |

## 3.9 Team Stats & Performance

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| STATS-1 | The system tracks team-level stats: wins, losses, ties, goals for/against, league rank | High | ✅ Schema implemented |
| STATS-2 | The system tracks player-level stats: games played, goals, assists, cards, minutes | High | ✅ Schema implemented |
| STATS-3 | Stats are organized by season | High | ✅ Implemented |
| STATS-4 | Stats are viewable by all team members | High | ✅ RLS implemented |
| STATS-5 | The system should display stats in charts and visualizations | Medium | ⚠️ Recharts available, UI partial |

## 3.10 Video & Recruiting

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| VID-1 | Managers can add video links (YouTube, Veo, HUDL, Trace, etc.) associated with events or team | High | ✅ Schema implemented |
| VID-2 | Video links display with platform, title, and thumbnail | High | ⚠️ UI exists, not wired to team context |
| VID-3 | The system provides AI-powered video clip advice for recruiting (what to include, how to structure) | Medium | ✅ Implemented (Perplexity API) |
| VID-4 | The system should support embedding videos from supported platforms | Medium | ❌ Not implemented |
| VID-5 | The system should integrate with Veo API for automated game recording management | Strategic | ❌ Phase 3 (Veo API is not public; requires partnership) |
| VID-6 | The system should integrate with HUDL API for video analysis | Strategic | ❌ Phase 3 (HUDL API requires enterprise partnership) |
| VID-7 | Players can create and manage a recruiting profile/portfolio | Medium | ❌ Not implemented |

## 3.11 Team Resources

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| RES-1 | Managers can add resource links (documents, websites, forms) to the team | High | ✅ Implemented |
| RES-2 | Resources can be categorized and pinned | High | ✅ Implemented |
| RES-3 | Resources are viewable by all team members | High | ✅ RLS implemented |

## 3.12 Club Executive Dashboard

| Req ID | Requirement | Priority | Status |
|--------|-------------|----------|--------|
| DASH-1 | Club admins see aggregate statistics across all teams | High | ⚠️ Partial (component exists) |
| DASH-2 | Dashboard shows total teams, total members, upcoming events, pending payments | High | ⚠️ Hardcoded zeros |
| DASH-3 | Dashboard shows financial summary (collected vs. outstanding) | High | ❌ Not wired to live data |
| DASH-4 | Dashboard shows recent results (game outcomes) | Medium | ⚠️ Component exists with demo data |

---

# 4. USER STORIES

## 4.1 Club Administrator Stories

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-CA-1 | As a club admin, I want to create a new club so that I can organize all my teams under one entity. | Club created with name, logo, colors. User automatically becomes club_admin. club_admins record created. | Critical |
| US-CA-2 | As a club admin, I want to create teams under my club so that each age group has its own space. | Team created with name, sport, age_group, gender. Team appears in club's team list. | Critical |
| US-CA-3 | As a club admin, I want to see a dashboard of all my teams' finances so that I have full visibility into club operations. | Dashboard shows total collected, total outstanding, per-team breakdown. Data is live from DB. | High |
| US-CA-4 | As a club admin, I want to assign team managers so that coaches can manage their own teams. | Admin can add a user as team_manager role to a specific team. Manager gains management permissions. | Critical |
| US-CA-5 | As a club admin, I want to standardize the trip planning process so that all teams follow the same workflow. | Trip templates available club-wide. Default expense categories. Standard approval workflows. | Medium |

## 4.2 Team Manager / Coach Stories

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-TM-1 | As a team manager, I want to create a trip with a full itinerary so that parents know exactly what to expect. | Trip created with destination, dates, detailed itinerary items with times, locations, costs, booking links. | Critical |
| US-TM-2 | As a team manager, I want to create an expense and split it across the team so that each family knows their share. | Expense created, automatically split equally among active team members. Each member sees their individual share. | Critical |
| US-TM-3 | As a team manager, I want to set up my payment account so that I can receive expense payments from parents. | Stripe Connect Express onboarding completed. Charges and payouts enabled. | Critical |
| US-TM-4 | As a team manager, I want to send a message to all team parents so that everyone is informed. | Message sent, stored in DB, email notification sent to all team members. | High |
| US-TM-5 | As a team manager, I want to track attendance at practices and games so that I know who shows up consistently. | Attendance marked per event per player. Historical attendance viewable. | High |
| US-TM-6 | As a team manager, I want to add game and practice videos so that players can review their performance. | Video link added with platform, title, optional event association. Visible to all team members. | Medium |
| US-TM-7 | As a team manager, I want to manage the team roster (add/remove players, set positions and jersey numbers) so that the roster is always current. | Team members added/removed. Position, jersey number, active status editable. | Critical |
| US-TM-8 | As a team manager, I want to create a season schedule so that families can plan ahead. | Events created for the season. Calendar view shows all events. Export to personal calendar. | High |
| US-TM-9 | As a team manager who fronted travel expenses on my credit card, I want to request reimbursement from the team so that I get paid back promptly. | Expense created as reimbursement type. Split across team. Parents can pay via card or ACH. Funds go to manager's Connect account. | Critical |

## 4.3 Parent Stories

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-P-1 | As a parent, I want to see all payments I owe across all my children's teams so that I don't miss any. | Dashboard aggregates pending payments across all teams. Clear amount, due date, description. | Critical |
| US-P-2 | As a parent, I want to pay my share of team expenses with my preferred payment method so that it's convenient. | Payment via card (2.9% + $0.30), ACH (0.8%, capped $5), or Venmo. One-click checkout. | Critical |
| US-P-3 | As a parent, I want to see a transparent breakdown of trip costs so that I trust what I'm being charged. | Expense detail shows line items, per-person cost calculation, total cost, receipt if available. | High |
| US-P-4 | As a parent, I want to view the team schedule and trip itinerary so that I can plan family logistics. | Calendar view of events. Trip detail view with full itinerary. Export to personal calendar. | High |
| US-P-5 | As a parent, I want to manage my child's profile (jersey number, position, medical info) so that the team has accurate information. | Child profile editable. Medical info stored separately with parent-only access. | High |
| US-P-6 | As a parent, I want to receive email notifications for new expenses, schedule changes, and team messages so that I stay informed. | Emails sent for: new expense share, event updates, team messages. | High |
| US-P-7 | As a parent with multiple children on different teams, I want to switch between teams easily so that I can manage all of them from one account. | Team switcher in navigation. All data contextual to selected team. | High |

## 4.4 Player Stories

| ID | User Story | Acceptance Criteria | Priority |
|----|-----------|---------------------|----------|
| US-PL-1 | As a player, I want to view the team schedule so that I know when and where to show up. | Calendar view accessible. Event details include time, location, opponent. | High |
| US-PL-2 | As a player, I want to view team game videos so that I can review my performance. | Video links accessible. Embedded or linked to platform. | Medium |
| US-PL-3 | As a player, I want to get AI advice on creating a recruiting video so that I can showcase my skills to college coaches. | AI advisor provides sport/position-specific guidance on video structure, content, and technical tips. | Medium |

---

# 5. TECHNICAL REQUIREMENTS DOCUMENT (TRD)

## 5.1 Technology Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Frontend Framework** | React | 18.3.1 | SPA with client-side routing |
| **Build Tool** | Vite | Latest | Fast HMR, ES modules |
| **Language** | TypeScript | 5.x | Strict mode |
| **CSS Framework** | Tailwind CSS | 3.x | With tailwindcss-animate |
| **Component Library** | shadcn/ui | Latest | Radix UI primitives + Tailwind |
| **Routing** | React Router | 6.30.1 | Client-side routing |
| **State Management** | React Context + TanStack Query | 5.83.0 | Server state caching |
| **Charts** | Recharts | 2.15.4 | Data visualization |
| **Form Handling** | React Hook Form + Zod | 7.61.1 / 3.25.76 | Validated forms |
| **Backend** | Supabase (Lovable Cloud) | Latest | PostgreSQL + Auth + Edge Functions + Storage |
| **Payment Processing** | Stripe | Latest | Connect Express + Checkout Sessions |
| **Email** | Resend | Latest | Transactional emails |
| **AI** | Perplexity API | sonar-pro | Video recruiting advisor |
| **Hosting** | Lovable Cloud | — | Automatic deployment |

## 5.2 Infrastructure Requirements

### 5.2.1 Database
- **Engine**: PostgreSQL 15+ (via Supabase)
- **Connection pooling**: PgBouncer (managed by Supabase)
- **Row-Level Security (RLS)**: Enabled on ALL tables
- **Backup**: Automated daily backups (Supabase managed)
- **Storage**: Supabase Storage for file uploads (receipts, logos)

### 5.2.2 Authentication
- **Provider**: Supabase Auth
- **Methods**: Email/password (with email verification)
- **Session**: JWT-based, auto-refresh, persisted in localStorage
- **Security**: PKCE flow, secure token handling

### 5.2.3 Edge Functions (Serverless)
- **Runtime**: Deno (via Supabase Edge Functions)
- **Auto-deploy**: Yes (on code push)
- **Functions deployed**:
  - `create-connect-account` — Stripe Connect onboarding
  - `check-connect-status` — Verify Connect account status
  - `create-expense-payment` — Stripe Checkout for expenses
  - `create-recruiting-payment` — Stripe Checkout for recruiting fees
  - `send-email` — Transactional email via Resend
  - `video-clip-advisor` — AI-powered recruiting advice via Perplexity

### 5.2.4 External Services

| Service | Purpose | API Key Required | Status |
|---------|---------|-----------------|--------|
| Stripe | Payment processing | STRIPE_SECRET_KEY | ✅ Configured |
| Resend | Email delivery | RESEND_API_KEY | ✅ Configured |
| Perplexity | AI video advisor | PERPLEXITY_API_KEY | ✅ Configured |

### 5.2.5 Browser Support
- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+
- Mobile browsers (responsive design)

### 5.2.6 Performance Requirements

| Metric | Target | Notes |
|--------|--------|-------|
| First Contentful Paint | < 1.5s | Vite optimized bundle |
| Time to Interactive | < 3.0s | Code splitting per route |
| API Response Time | < 500ms (p95) | Supabase + PgBouncer |
| Concurrent Users | 1,000+ | Supabase managed scaling |
| Database Size | 10GB+ | Supabase plan dependent |

## 5.3 Security Requirements

| Req ID | Requirement | Status |
|--------|-------------|--------|
| SEC-1 | All data access controlled by RLS policies | ✅ Implemented |
| SEC-2 | Roles stored in separate table, checked via SECURITY DEFINER functions | ✅ Implemented |
| SEC-3 | Medical data isolated in parent-only accessible table | ✅ Implemented |
| SEC-4 | No private API keys in client-side code | ✅ Implemented |
| SEC-5 | Input validation on all edge functions | ✅ Implemented |
| SEC-6 | CORS headers configured on all edge functions | ✅ Implemented |
| SEC-7 | UUID validation on all ID parameters | ✅ Implemented |
| SEC-8 | XSS prevention in email templates (HTML escaping) | ✅ Implemented |
| SEC-9 | Stripe Connect payments verified against authenticated user | ✅ Implemented |
| SEC-10 | Rate limiting on API endpoints | ❌ Not implemented |
| SEC-11 | Content Security Policy headers | ❌ Not implemented |
| SEC-12 | GDPR/CCPA data deletion support | ❌ Not implemented |

---

# 6. SYSTEM ARCHITECTURE DOCUMENT

## 6.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  React SPA   │  │  Supabase JS │  │  Stripe.js (card) │  │
│  │  (Vite/TS)   │  │    Client    │  │                   │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE CLOUD                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL   │  │  Auth (GoTrue)│  │  Edge Functions  │  │
│  │  + RLS        │  │              │  │  (Deno Runtime)  │  │
│  │  + Realtime   │  │  JWT/Session │  │                  │  │
│  └──────┬───────┘  └──────────────┘  └────────┬─────────┘  │
│         │                                      │            │
│  ┌──────┴───────┐                    ┌─────────┴─────────┐  │
│  │   Storage     │                    │  External APIs     │  │
│  │  (Receipts,   │                    │  ┌─────────────┐  │  │
│  │   Logos)      │                    │  │   Stripe     │  │  │
│  └──────────────┘                    │  │   Resend     │  │  │
│                                      │  │   Perplexity │  │  │
│                                      │  └─────────────┘  │  │
│                                      └───────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 6.2 Data Model Overview

```
League (1) ──── (N) Club (1) ──── (N) Team (1) ──── (N) Event
                      │                  │                  │
                      │                  │                  └── Event Attendance
                      │                  │
                      │                  ├── (N) Team Member ──── Profile
                      │                  │         │
                      │                  │         ├── Player Stats
                      │                  │         └── Message Recipients
                      │                  │
                      │                  ├── (N) Team Child Member ──── Child Profile
                      │                  │                                    │
                      │                  │                              Child Medical Info
                      │                  │
                      │                  ├── (N) Trip ──── (N) Trip Itinerary
                      │                  │
                      │                  ├── (N) Expense ──── (N) Expense Share
                      │                  │
                      │                  ├── (N) Payment
                      │                  │
                      │                  ├── (N) Message
                      │                  │
                      │                  ├── (N) Video Link
                      │                  │
                      │                  ├── (N) Team Resource
                      │                  │
                      │                  ├── (N) Team Stats
                      │                  │
                      │                  └── (N) Season
                      │
                      └── (N) Club Admin
                      
User ──── Profile
  │
  ├── (N) User Roles
  ├── (N) Connected Accounts (Stripe)
  └── (N) Child Profiles
```

## 6.3 Authentication Flow

```
1. User visits /auth
2. Signs up with email/password/full_name/role(parent)
3. Supabase Auth creates auth.users record
4. Trigger: handle_new_user() creates profiles record
5. Client inserts user_roles record with 'parent' role
6. Email verification sent
7. User verifies email → can sign in
8. On sign in: JWT issued, session persisted
9. Client fetches profile + roles from public schema
10. App renders based on roles (admin/manager/parent/player)
```

## 6.4 Payment Flow (Stripe Connect Express)

```
Manager Onboarding:
1. Manager clicks "Set Up Payments" → calls create-connect-account edge function
2. Edge function creates Stripe Express account + account link
3. Manager redirected to Stripe-hosted onboarding
4. On completion: connected_accounts record updated with charges_enabled=true

Parent Payment:
1. Manager creates expense → split into expense_shares
2. Parent views their share → clicks "Pay"
3. Client calls create-expense-payment edge function
4. Edge function creates Stripe Checkout Session with:
   - payment_method_types: card or us_bank_account (ACH)
   - transfer_data.destination: manager's connected account
   - zero platform fee
5. Parent redirected to Stripe-hosted checkout
6. On success: expense_share updated with paid_at, payment method
```

## 6.5 Email Notification Flow

```
1. Trigger event (new message, expense, event change)
2. Client or edge function calls send-email edge function
3. send-email validates input, generates HTML from templates
4. Calls Resend API to send email
5. Templates: attendance_reminder, event_notification, team_announcement, custom
```

## 6.6 Context & State Architecture

```
QueryClientProvider (TanStack Query - server state cache)
  └── TooltipProvider
        └── AuthProvider (useAuth - user, session, profile, roles)
              └── TeamProvider (useTeam - selected team, teams list)
                    └── BrowserRouter
                          └── Routes
                                ├── Landing (public)
                                ├── Auth (public)
                                └── Protected Routes
                                      ├── Dashboard
                                      ├── Schedule (useEvents)
                                      ├── Attendance (useAttendance)
                                      ├── Roster (useRoster)
                                      ├── Trips (useTrips)
                                      ├── Expenses (useExpenses)
                                      ├── Payments (usePayments)
                                      ├── Stats
                                      ├── Resources (useTeamResources)
                                      ├── Recruiting (useRecruiting)
                                      └── Profile
```

---

# 7. FUNCTIONAL SPECIFICATION DOCUMENT (FSD)

## 7.1 Navigation & Layout

### 7.1.1 Main Navigation Bar
- **Position**: Sticky top, full width
- **Background**: Sidebar theme color
- **Left section**: Team switcher (Select dropdown)
  - Shows current team logo, club name, and team name
  - Dropdown lists all user's teams with logos
  - "Create New Team" option at bottom
- **Center section**: Navigation tabs
  - Dashboard, Schedule, Attendance, Roster, Trips, Expenses, Payments, Stats, Resources, Recruiting
  - Icons + labels (labels hidden on mobile)
  - Active state: sidebar-accent background
- **Right section**: Profile link + Sign Out button

### 7.1.2 Team Context Behavior
- All data-driven pages must use `useTeam()` hook to get selected team ID
- When team changes, all data refetches for the new team
- If no team selected, show "No Team Selected" empty state
- Selected team persisted in localStorage per user

## 7.2 Page-by-Page Specifications

### 7.2.1 Landing Page (/)
- **Access**: Public (unauthenticated)
- **Auto-redirect**: If authenticated, redirect to /dashboard
- **Sections**: Hero, Features (5 cards), Benefits checklist, Mock dashboard card, CTA, Footer
- **CTAs**: "Start Free Today" and "Get Started Free" → /auth

### 7.2.2 Authentication Page (/auth)
- **Modes**: Sign In (default), Sign Up
- **Sign Up fields**: Full Name, Email, Password, Role (fixed: Parent)
- **Sign In fields**: Email, Password
- **Post-sign-up**: Show email verification notice
- **Post-sign-in**: Redirect to /dashboard

### 7.2.3 Dashboard (/dashboard)
- **Components**: TeamHeader, WelcomeHero (sport-themed), Quick Actions (4 buttons), Stats Cards (3), Getting Started empty state
- **Quick Actions**: Create Club (admin only), Add Team (admin only), View Schedule, Payments, Trips
- **Stats Cards**: My Teams count, Upcoming Events count, Pending Payments/Amount Due
- **Club Executive Dashboard**: Shown only for club_admin role

### 7.2.4 Schedule (/schedule)
- **View**: Calendar with month navigation
- **Event types**: Practice (blue), Game (green), Tournament (purple), Meeting (gray)
- **Event cards**: Show time, title, location, opponent (for games)
- **Actions (manager)**: Create event, edit event, delete event, import schedule
- **Export**: iCal format download

### 7.2.5 Roster (/roster)
- **Table columns**: Name, Position, Jersey #, Role, Phone (manager only), Actions
- **Data source**: team_members + profiles (via join or RPC function)
- **Child members**: team_child_members + child_profiles
- **Actions (manager)**: Add member, edit position/jersey, remove member

### 7.2.6 Trips (/trips)
- **List view**: Cards showing trip name, destination, dates, item count
- **Detail view**: Full itinerary with chronological items
- **Itinerary item types**: travel, lodging, meal, activity, game, other
- **Each item shows**: Time, title, location, cost estimate, booking link
- **Actions (manager)**: Create trip, add/edit/remove itinerary items

### 7.2.7 Expenses (/expenses)
- **Summary**: Total team expenses, collected, outstanding
- **Expense cards**: Title, category, total amount, split details, status
- **Expense shares**: Per-member breakdown with pay button
- **Payment flow**: Stripe Checkout (card or ACH)
- **Connect setup**: Required before receiving payments

### 7.2.8 Payments (/payments)
- **Summary card**: Total amount due (parent) / total pending collection (manager)
- **Sections**: Pending Payments, Payment History
- **Payment methods**: Card, Venmo (deep link), ACH
- **Manager actions**: Mark as paid, create new payment request

### 7.2.9 Stats (/stats)
- **Team stats**: W-L-T record, goals for/against, league rank
- **Player stats table**: Games played, goals, assists, cards, minutes
- **Data organized by season**

### 7.2.10 Attendance (/attendance)
- **Event selector**: Choose event to mark attendance
- **Roster list**: Each member with status toggle (present/absent/late/excused)
- **History view**: Per-member attendance across events

### 7.2.11 Resources (/resources)
- **Resource cards**: Title, description, category, link, icon
- **Categories**: Pinned (top), then by category
- **Manager actions**: Add resource, edit, delete, pin/unpin

### 7.2.12 Recruiting (/recruiting)
- **Video Clip Advisor**: AI-powered form
  - Inputs: Sport, Position, Target Level (D1/D2/D3/NAIA/JUCO)
  - Output: Detailed advice on video structure, content, common mistakes
  - Source: Perplexity sonar-pro model with citations

### 7.2.13 Profile (/profile)
- **Fields**: Full Name, Email (read-only), Phone, Primary Sport, Venmo Handle, Avatar
- **Child management**: Add/edit child profiles
- **Settings**: Notification preferences (not yet persisted)

## 7.3 Data Flow Diagrams

### 7.3.1 Expense Creation Flow
```
Manager creates expense
    │
    ▼
POST to expenses table (RLS: manager of team)
    │
    ▼
Client calculates equal split (total ÷ active members)
    │
    ▼
INSERT expense_shares for each team member
    │
    ▼
Each parent sees their share on Expenses page
    │
    ▼
Parent clicks "Pay" → create-expense-payment edge function
    │
    ▼
Stripe Checkout Session created (destination: manager's Connect account)
    │
    ▼
Parent pays on Stripe → redirect back to app
    │
    ▼
expense_share updated with paid_at, stripe_payment_intent_id
```

### 7.3.2 Team Context Data Flow
```
User signs in → AuthProvider sets user/session
    │
    ▼
TeamProvider calls useUserTeams() → fetches teams from DB
    │
    ▼
Auto-select first team (or load from localStorage)
    │
    ▼
Each page component calls useTeam() to get team.id
    │
    ▼
Data hooks (useEvents, useTrips, etc.) query with team_id filter
    │
    ▼
RLS policies verify user is team member before returning data
```

---

# 8. API DOCUMENTATION

## 8.1 Edge Functions

### 8.1.1 `create-connect-account`

**Purpose**: Create or resume Stripe Connect Express account onboarding for a team manager.

**Endpoint**: `POST /functions/v1/create-connect-account`

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "clubId": "uuid (optional)",
  "teamId": "uuid (optional)",
  "refreshUrl": "https://... (optional)",
  "returnUrl": "https://... (optional)"
}
```

**Response (200)**:
```json
{
  "url": "https://connect.stripe.com/setup/...",
  "accountId": "acct_..."
}
```

**Error Responses**:
- `500`: Payment service not configured / Not authenticated / General error

**Behavior**:
- If user already has a connected_accounts record, reuses the existing Stripe account
- Creates new Express account with card_payments, transfers, and us_bank_account_ach_payments capabilities
- Returns Stripe-hosted onboarding URL

---

### 8.1.2 `check-connect-status`

**Purpose**: Check the onboarding status of a user's Stripe Connect account.

**Endpoint**: `POST /functions/v1/check-connect-status`

**Authentication**: Required (Bearer token)

**Response (200)**:
```json
{
  "hasAccount": true,
  "chargesEnabled": true,
  "payoutsEnabled": true,
  "onboardingComplete": true
}
```

---

### 8.1.3 `create-expense-payment`

**Purpose**: Create a Stripe Checkout Session for a parent to pay their expense share.

**Endpoint**: `POST /functions/v1/create-expense-payment`

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "expenseShareId": "uuid",
  "paymentMethod": "card" | "ach"
}
```

**Response (200)**:
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Validation**:
- expenseShareId must be valid UUID
- paymentMethod must be "card" or "ach"
- User must own the expense share
- Manager must have a charges-enabled Connect account

**Payment Flow**:
- Card: Standard Stripe Checkout with card payment
- ACH: Stripe Checkout with us_bank_account, uses Plaid for bank connection
- Zero platform fee; funds transfer directly to manager's Connect account

---

### 8.1.4 `create-recruiting-payment`

**Purpose**: Process payments for recruiting-related services.

**Endpoint**: `POST /functions/v1/create-recruiting-payment`

**Authentication**: Required (Bearer token)

---

### 8.1.5 `send-email`

**Purpose**: Send transactional emails to team members.

**Endpoint**: `POST /functions/v1/send-email`

**Authentication**: Not required (called internally)

**Request Body**:
```json
{
  "to": "email@example.com" | ["email1@example.com", "email2@example.com"],
  "subject": "string (max 200 chars)",
  "type": "attendance_reminder" | "event_notification" | "team_announcement" | "custom",
  "data": {
    "recipientName": "string (optional)",
    "eventName": "string (optional)",
    "eventDate": "string (optional)",
    "eventTime": "string (optional)",
    "eventLocation": "string (optional)",
    "teamName": "string (optional)",
    "message": "string (optional, max 5000 chars)"
  }
}
```

**Response (200)**:
```json
{
  "success": true,
  "id": "email-id-from-resend"
}
```

**Validation**:
- 1–50 recipients
- Valid email format
- Subject required, max 200 chars
- Type must be one of predefined values
- Custom HTML not supported (XSS prevention)

---

### 8.1.6 `video-clip-advisor`

**Purpose**: Provide AI-powered advice on creating college recruiting videos.

**Endpoint**: `POST /functions/v1/video-clip-advisor`

**Authentication**: Not required

**Request Body**:
```json
{
  "sport": "string (required, max 50 chars)",
  "position": "string (required, max 50 chars)",
  "level": "D1" | "D2" | "D3" | "NAIA" | "Junior College" | "NJCAA",
  "highlights": "string (optional, max 1000 chars)"
}
```

**Response (200)**:
```json
{
  "advice": "Detailed markdown-formatted advice...",
  "citations": ["url1", "url2"],
  "sport": "Soccer",
  "position": "Center Back",
  "level": "D1"
}
```

## 8.2 Database Security Functions (RPC)

| Function | Purpose | Security |
|----------|---------|----------|
| `has_role(_user_id, _role)` | Check if user has a specific app role | SECURITY DEFINER |
| `is_club_admin(_user_id, _club_id)` | Check if user is admin of a specific club | SECURITY DEFINER |
| `is_team_manager(_user_id, _team_id)` | Check if user is manager of a specific team | SECURITY DEFINER |
| `is_team_member(_user_id, _team_id)` | Check if user is member of a specific team | SECURITY DEFINER |
| `is_parent_of(_user_id, _child_id)` | Check if user is parent of a specific child | SECURITY DEFINER |
| `get_team_member_profiles(_team_id)` | Get basic profiles (name, avatar) for team members without exposing PII | SECURITY DEFINER |

## 8.3 Client-Side Data Hooks

| Hook | Purpose | DB Tables |
|------|---------|-----------|
| `useAuth()` | Authentication state, roles, profile | profiles, user_roles |
| `useTeam()` | Selected team context, team switching | teams, clubs, team_members |
| `useUserTeams()` | Fetch all teams for current user | team_members, teams, clubs |
| `useEvents()` | CRUD events for selected team | events |
| `useAttendance()` | Mark and view event attendance | event_attendance |
| `useRoster()` | Fetch team roster with profiles | team_members, profiles |
| `useTrips()` | CRUD trips and itinerary | trips, trip_itinerary |
| `useExpenses()` | CRUD expenses and shares | expenses, expense_shares |
| `usePayments()` | CRUD payment requests | payments |
| `useMessages()` | Send and view team messages | messages, message_recipients |
| `useTeamResources()` | CRUD team resource links | team_resources |
| `useRecruiting()` | Video clip advisor interactions | (edge function call) |
| `useClubStatistics()` | Club-level aggregate data | teams, team_members, events, payments |
| `useEmail()` | Send emails via edge function | (edge function call) |

---

# 9. COMPETITIVE ANALYSIS

## 9.1 Competitor Matrix

| Feature | **Champions** | **TeamSnap** | **Snap! Spend** | **LeagueApps** | **HUDL** | **SportsEngine** |
|---------|:------------:|:-----------:|:---------------:|:--------------:|:--------:|:----------------:|
| **Team Scheduling** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| **Attendance Tracking** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Roster Management** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| **Team Messaging** | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Basic Payment Collection** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Expense Splitting** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Trip Planning** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Trip Itinerary** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Stripe Connect (Direct Pay)** | ✅ | ❌ | ❌ (Plaid/Thread Bank) | ❌ | ❌ | ❌ |
| **ACH Payments** | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Zero Platform Fee** | ✅ | ❌ | ❌ (4.5% card) | ❌ | N/A | ❌ |
| **Video Links** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **AI Video Advisor** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **College Recruiting** | ⚠️ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Club-Level Dashboard** | ⚠️ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Player Statistics** | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Registration** | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| **Website Builder** | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| **Mobile App (Native)** | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Live Streaming** | ❌ | ✅ (via partners) | ❌ | ❌ | ✅ | ❌ |

## 9.2 Competitive Positioning

### Champions' Unique Value Proposition

1. **Only platform combining team management + travel + expense splitting**: No competitor offers trip planning with detailed itineraries AND per-player expense splitting in one tool.

2. **Zero platform fee on payments**: Snap!Spend charges 4.5% on card payments. TeamSnap charges for premium payment features. Champions passes through only Stripe's base fees.

3. **ACH-first payment strategy**: Prioritizing bank transfers (0.8%, capped at $5) saves families significant money on large payments like tournament fees ($500+).

4. **AI-powered recruiting tools**: No competitor offers AI-driven advice for creating recruiting videos, tailored to sport, position, and target college level.

5. **Modern tech stack**: Built on React + Supabase vs. legacy monolithic architectures (SportsEngine, TeamSnap original platform).

### Champions' Weaknesses vs. Competitors

1. **No native mobile app**: TeamSnap, Snap!Spend, and LeagueApps all have native iOS/Android apps. Champions is web-only (responsive).

2. **No player registration**: LeagueApps and SportsEngine handle the full registration flow (forms, waivers, payments). Champions starts after teams are formed.

3. **No website builder**: LeagueApps provides club websites. Champions does not.

4. **Smaller ecosystem**: TeamSnap has integrations with GameChanger, Dick's Sporting Goods, and live streaming partners.

5. **No direct booking**: Travel booking (flights, hotels, cars) requires external tools. This is the Phase 3 strategic vision.

## 9.3 Snap!Spend Deep Dive (Primary Financial Competitor)

Based on customer discovery research (Albion SC uses Snap!Spend):

**What Snap!Spend does well:**
- Invoice creation and distribution
- AutoPay authorization
- Multiple payment methods (bank via Plaid, credit card)
- Participant-based organization (by child, by group/season)
- Invoice approval workflow (parents must approve before paying)

**What Snap!Spend does poorly / doesn't do:**
- No travel planning or itinerary management
- No team scheduling or communication
- Complex UI (multiple steps to make a simple payment)
- High card processing fees (4.5% vs. 2.9% industry standard)
- No trip expense splitting or real-time tracking
- Banking product complexity (Thread Bank partnership, FDIC language) that may confuse parents

**Champions advantage over Snap!Spend:**
- All-in-one platform (schedule + roster + travel + expenses + communication)
- Lower fees (2.9% card, 0.8% ACH, zero platform fee)
- Simpler payment UX (Stripe Checkout is best-in-class)
- Trip-centric expense management (not just invoices)

---

# 10. CUSTOMER DISCOVERY ALIGNMENT

## 10.1 Mapping Discovery Questions to Features

Based on the customer discovery plan from the uploaded document:

### Club COO Questions → Feature Mapping

| Discovery Question | Champions Feature | Status |
|-------------------|-------------------|--------|
| "How many teams travel overnight?" | Team & trip management with club-level visibility | ✅ Implemented |
| "How do teams book flights, cars, hotels?" | Trip itinerary with booking URLs and references | ✅ Implemented (links, not direct booking) |
| "Who handles travel booking?" | Team manager role with trip creation permissions | ✅ Implemented |
| "What are the problems during booking?" | Trip itinerary with timeline, cost estimates, booking status | ⚠️ Partial (no booking status tracking) |
| "What happens when a kid can't make it?" | Needs: Trip RSVP/commitment tracking, cancellation workflow | ❌ Not implemented |
| "How much time does the travel coordinator spend?" | Trip templates, automated expense splitting | ⚠️ Partial |
| "Do parents have a clear idea of trip cost?" | Expense splitting with per-player cost breakdown | ✅ Implemented |
| "Does someone usually front the $$?" | Manager reimbursement via Stripe Connect | ✅ Implemented |
| "How do they usually collect?" | Multiple payment methods (card, ACH, Venmo) | ✅ Implemented |
| "Do most folks use spreadsheets?" | Full digital expense tracking replaces spreadsheets | ✅ Implemented |
| "Are there issues with transparency?" | All expenses visible to team members via RLS | ✅ Implemented |
| "What key software tools help run the club?" | All-in-one platform replacing multiple tools | ✅ Architecture |
| "How do you buy them?" | Club subscription model | ❌ Not implemented (pricing) |

### Key Discovery Insights NOT Yet Addressed

| Insight | Required Feature | Priority |
|---------|-----------------|----------|
| Players drop out after booking → who absorbs cost? | Trip commitment/cancellation policy engine | High |
| Getting government IDs for group flights is painful | Secure document collection for travel | Medium |
| Per diem tracking for coaches/chaperones | Per diem expense type with daily tracking | Medium |
| Integration with PlayMetrics or other club systems of record | Data import/export, API integrations | Low |
| "Stay to Play" hotel requirements at tournaments | Hotel block management / partner integration | Phase 3 |

---

# 11. GAP ANALYSIS & FEATURE ROADMAP

## 11.1 Current Gaps (Must Fix for Production)

| # | Gap | Impact | Effort | Priority |
|---|-----|--------|--------|----------|
| G-1 | Dashboard shows hardcoded zeros instead of live data | Users think app is broken | Low | P0 |
| G-2 | Pages don't use TeamContext — show wrong data or require "Load Demo" | Core functionality broken | Medium | P0 |
| G-3 | Roster uses demo data instead of live DB | Core feature broken | Low | P0 |
| G-4 | No "Add Team" button wiring on dashboard | Dead button | Low | P0 |
| G-5 | Stats page uses demo data | Feature broken | Low | P1 |
| G-6 | Video links not wired to team context | Feature broken | Low | P1 |
| G-7 | Notification preferences not persisted | Settings don't save | Low | P1 |
| G-8 | No onboarding flow for new users | Users don't know what to do | Medium | P1 |
| G-9 | No loading/empty states for many data views | Poor UX | Low | P1 |
| G-10 | No error boundaries or graceful error handling | App crashes on errors | Medium | P1 |

## 11.2 Feature Roadmap

### Phase 1: Production Ready (4–6 weeks)

| Feature | Description | Priority |
|---------|-------------|----------|
| Wire team context everywhere | All pages use selected team from TeamContext | P0 |
| Live dashboard data | Stats cards show real counts from DB | P0 |
| Live roster | Replace demo data with real team_members + profiles | P0 |
| Live stats | Replace demo data with real team_stats + player_stats | P1 |
| Onboarding wizard | Guide new users: create club → create team → add members → create first event | P1 |
| Error handling | Error boundaries, toast notifications, retry logic | P1 |
| Loading states | Skeleton loaders for all data-driven components | P1 |
| Mobile navigation | Hamburger menu / bottom tabs for mobile | P1 |
| SEO & meta tags | Proper title, description, OG tags for landing page | P1 |
| Terms of Service & Privacy Policy | Legal pages required before launch | P0 |
| Email domain setup | Custom "from" address (not onboarding@resend.dev) | P1 |
| Basic analytics | Track user signups, team creation, payment volume | P1 |

### Phase 2: Market Fit (6–12 weeks)

| Feature | Description | Priority |
|---------|-------------|----------|
| Trip RSVP / commitment tracking | Parents confirm trip participation, cancellation workflow | P1 |
| Per-player trip cost calculator | Auto-calculate cost per player based on itinerary and group size | P1 |
| Recurring payments / installments | Season dues paid monthly | P1 |
| Venmo deep-link integration | One-tap Venmo payment with pre-filled amount | P2 |
| Push notifications (web) | Service worker notifications for messages, payments, events | P2 |
| Photo gallery | Upload and share team photos | P2 |
| Automated payment reminders | Scheduled emails for overdue payments | P1 |
| Receipt upload & storage | Managers upload receipts to Supabase Storage | P2 |
| Club-level financial reporting | Aggregate finances across all teams with export | P1 |
| Member invitation system | Email-based invite links to join a team | P1 |
| Google OAuth login | Sign in with Google | P2 |

### Phase 3: Expansion (3–6 months)

| Feature | Description | Priority |
|---------|-------------|----------|
| Native mobile app (React Native or PWA) | iOS/Android app | P1 |
| Travel booking integration | Partnership with WeTravel, Halpern, or direct hotel/airline APIs | P2 |
| Veo/HUDL video integration | Partnership-based API integration for game video | P2 |
| Player registration & waivers | Online registration forms with e-signatures | P2 |
| League/tournament management | Multi-club scheduling, standings, brackets | P3 |
| Advanced analytics & AI | Performance tracking, formation analysis, player development | P3 |
| White-label / custom branding | Clubs can brand the platform with their logo/colors | P2 |
| Multi-language support | Spanish, Portuguese for international programs | P3 |
| Stripe webhook processing | Real-time payment status updates (vs. polling) | P1 |
| API for third-party integrations | Public REST API for club software integrations | P3 |

## 11.3 Video Strategy — Detailed Plan

### Current State
- `video_links` table stores URLs from any platform (Veo, HUDL, YouTube, Trace, etc.)
- `video-clip-advisor` edge function provides AI recruiting advice via Perplexity

### Near-Term (Phase 1–2)
1. **Link-based approach**: Users paste video URLs from their preferred platform
2. **Auto-detect platform**: Parse URL to identify Veo, HUDL, YouTube, Trace
3. **Embed support**: oEmbed or iframe embedding for supported platforms (YouTube, Veo)
4. **Event association**: Link videos to specific games/events
5. **Team video gallery**: Browse all team videos in a dedicated view

### Long-Term (Phase 3)
1. **Veo Partnership**: Veo does not have a public API. Would require:
   - Business partnership discussion
   - OAuth-based account linking
   - Access to recording management, highlight creation, analytics
   - Veo Cam 3 supports soccer, basketball, football, lacrosse, hockey, volleyball, handball, field hockey, rugby, American football
   
2. **HUDL Partnership**: HUDL API requires enterprise partnership:
   - Video analysis integration
   - Play tagging and breakdown
   - StatsBomb API for advanced analytics
   - Major customer base overlap (high school + club teams)

3. **AI Video Analysis**: Using Lovable AI models (e.g., Gemini 2.5 Pro for video frame analysis):
   - Upload short clips for AI feedback
   - Position-specific performance analysis
   - Highlight reel suggestions
   - This is technically feasible with current tools but cost-intensive

### Recommendation
Start with the link-based approach (it's already 80% built), add embedding for YouTube/Veo, and pursue Veo partnership conversations in parallel. The AI video advisor is a unique differentiator — expand it to include post-game analysis prompts.

---

# 12. PRODUCTION READINESS PLAN

## 12.1 Pre-Launch Checklist

### Technical

| # | Task | Status | Owner | Est. Hours |
|---|------|--------|-------|-----------|
| T-1 | Wire team context to all pages (Schedule, Trips, Payments, Roster, Stats, Resources, Attendance, Messages) | ❌ | Dev | 8–12 |
| T-2 | Dashboard live data (team count, events count, payment totals) | ❌ | Dev | 4–6 |
| T-3 | Replace demo roster data with live DB queries | ❌ | Dev | 3–4 |
| T-4 | Replace demo stats data with live DB queries | ❌ | Dev | 3–4 |
| T-5 | Add error boundaries and graceful error handling | ❌ | Dev | 4–6 |
| T-6 | Add loading skeletons to all data-driven pages | ❌ | Dev | 3–4 |
| T-7 | Mobile-responsive navigation (hamburger/bottom tabs) | ❌ | Dev | 6–8 |
| T-8 | Stripe webhook endpoint for payment confirmation | ❌ | Dev | 6–8 |
| T-9 | Set up custom email domain (Resend) | ❌ | Dev | 2–3 |
| T-10 | Rate limiting on edge functions | ❌ | Dev | 4–6 |
| T-11 | Content Security Policy headers | ❌ | Dev | 2–3 |
| T-12 | Add Sentry or similar error tracking | ❌ | Dev | 2–3 |
| T-13 | Performance audit (Lighthouse) and optimization | ❌ | Dev | 4–6 |
| T-14 | End-to-end testing (critical flows) | ❌ | QA | 8–12 |
| T-15 | Security audit (RLS policies, edge function validation) | ❌ | Security | 8–12 |

### Business

| # | Task | Status | Owner | Est. Hours |
|---|------|--------|-------|-----------|
| B-1 | Terms of Service document | ❌ | Legal | 8–16 |
| B-2 | Privacy Policy (COPPA-compliant) | ❌ | Legal | 8–16 |
| B-3 | Stripe Connect compliance review | ❌ | Legal | 4–8 |
| B-4 | Custom domain setup (championsleagues.com or similar) | ❌ | Ops | 2–4 |
| B-5 | Landing page copy refinement | ❌ | Marketing | 4–6 |
| B-6 | Onboarding email sequence | ❌ | Marketing | 4–6 |
| B-7 | Pricing page | ❌ | Product | 4–6 |
| B-8 | Help/FAQ documentation | ❌ | Product | 8–12 |
| B-9 | Beta test with 2–3 clubs (Albion, etc.) | ❌ | Sales | 20–40 |
| B-10 | Feedback collection and iteration | ❌ | Product | Ongoing |

## 12.2 Launch Timeline (Recommended)

```
Week 1-2:  Wire team context + live data (T-1, T-2, T-3, T-4)
Week 3-4:  Error handling + loading states + mobile nav (T-5, T-6, T-7)
Week 5-6:  Stripe webhooks + email domain + security (T-8, T-9, T-10, T-11)
Week 7-8:  Testing + security audit + performance (T-13, T-14, T-15)
Week 5-8:  Legal docs + domain + pricing page (B-1 through B-8, parallel)
Week 9-12: Beta program with 2-3 clubs (B-9)
Week 13:   Public launch
```

## 12.3 Key Metrics to Track Post-Launch

| Metric | Target (Month 1) | Target (Month 6) |
|--------|-----------------|-------------------|
| Registered clubs | 3–5 (beta) | 25–50 |
| Active teams | 10–20 | 100–250 |
| Monthly payment volume processed | $5,000–$10,000 | $100,000–$500,000 |
| User retention (monthly) | 70%+ | 80%+ |
| Payment collection rate | 85%+ | 90%+ |
| NPS score | 30+ | 50+ |
| Average time to create trip | < 15 min | < 10 min |
| Support tickets per user/month | < 2 | < 1 |

---

# 13. APPENDICES

## Appendix A: Database Table Summary

| Table | Row Count (Est.) | Primary Use |
|-------|-----------------|-------------|
| profiles | 1 per user | User identity and contact |
| user_roles | 1–2 per user | Role-based access control |
| clubs | 1 per club | Club entity |
| club_admins | 1–5 per club | Club admin membership |
| teams | 3–20 per club | Team entity |
| team_members | 15–25 per team | Adult team membership |
| team_child_members | 15–25 per team | Child team membership |
| child_profiles | 1–3 per parent | Child identity |
| child_medical_info | 1 per child | Restricted medical data |
| events | 50–200 per team/season | Schedule entries |
| event_attendance | (events × members) | Attendance records |
| trips | 2–8 per team/season | Travel plans |
| trip_itinerary | 5–20 per trip | Itinerary items |
| expenses | 5–20 per team/season | Team expenses |
| expense_shares | (expenses × members) | Individual shares |
| payments | 5–20 per team/season | Payment requests |
| messages | 20–100 per team/season | Team messages |
| message_recipients | (messages × members) | Delivery tracking |
| video_links | 5–50 per team/season | Game/highlight videos |
| team_resources | 5–20 per team | Shared links/docs |
| team_stats | 1–3 per team/season | Aggregate team stats |
| player_stats | 1 per player/season | Individual player stats |
| seasons | 1–4 per team | Season definitions |
| connected_accounts | 0–1 per manager | Stripe Connect accounts |
| leagues | 0–5 total | League entities |

## Appendix B: RLS Policy Summary

All tables have RLS enabled. Key patterns:
- **User data**: Users can only read/write their own records (profiles, user_roles, connected_accounts)
- **Team data**: Team members can read; managers can write (events, trips, expenses, messages, resources, stats)
- **Child data**: Parents read/write their own children; managers can read roster children (no medical access)
- **Financial data**: Members see their own shares; managers see all team finances
- **Club data**: Club admins have elevated access to all teams in their club

## Appendix C: Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| VITE_SUPABASE_URL | .env (auto) | Supabase project URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | .env (auto) | Supabase anon key |
| STRIPE_SECRET_KEY | Edge function secrets | Stripe API key |
| RESEND_API_KEY | Edge function secrets | Resend email API key |
| PERPLEXITY_API_KEY | Edge function secrets (connector) | Perplexity AI API key |
| LOVABLE_API_KEY | Edge function secrets | Lovable AI gateway |
| SUPABASE_SERVICE_ROLE_KEY | Edge function secrets (auto) | Supabase admin access |
| SUPABASE_URL | Edge function secrets (auto) | Supabase URL for edge functions |
| SUPABASE_ANON_KEY | Edge function secrets (auto) | Supabase anon key for edge functions |

## Appendix D: File Structure

```
src/
├── App.tsx                          # Root component with routing
├── main.tsx                         # Entry point
├── index.css                        # Design system tokens
├── components/
│   ├── ui/                          # shadcn/ui components (50+ files)
│   ├── MainNavigation.tsx           # Top nav with team switcher
│   ├── TeamHeader.tsx               # Team logo and name display
│   ├── WelcomeHero.tsx              # Dashboard hero section
│   ├── ClubExecutiveDashboard.tsx   # Admin aggregate view
│   ├── ScheduleCalendar.tsx         # Calendar component
│   ├── EventCard.tsx                # Event display card
│   ├── RosterTable.tsx              # Team roster table
│   ├── PlayerStatsTable.tsx         # Player statistics table
│   ├── AttendanceTracker.tsx        # Attendance marking UI
│   ├── TripPlanner.tsx              # Trip creation form
│   ├── TripsList.tsx                # Trip list view
│   ├── ExpenseManagerCard.tsx       # Expense management
│   ├── ExpenseShareCard.tsx         # Individual expense share
│   ├── CreateExpenseDialog.tsx      # New expense form
│   ├── PaymentsList.tsx             # Payment list component
│   ├── PaymentMethodButtons.tsx     # Card/ACH/Venmo buttons
│   ├── ConnectAccountSetup.tsx      # Stripe Connect onboarding
│   ├── MessagesList.tsx             # Team messages
│   ├── ComposeMessageDialog.tsx     # New message form
│   ├── VideoLinksCard.tsx           # Video gallery
│   ├── VideoClipAdvisor.tsx         # AI recruiting advisor
│   ├── TeamResourcesCard.tsx        # Resource links
│   ├── TeamStatsCard.tsx            # Team W-L-T display
│   ├── RecentResultsCard.tsx        # Recent game results
│   ├── ProfileSettingsDialog.tsx    # Profile editor
│   ├── ScheduleImportDialog.tsx     # Schedule import
│   ├── CreateTripDialog.tsx         # Trip creation
│   ├── LoadDemoDataButton.tsx       # Demo data loader
│   ├── NoTeamSelected.tsx           # Empty state
│   └── SportIcons.tsx               # Sport-specific icons
├── contexts/
│   └── TeamContext.tsx              # Team selection context
├── hooks/
│   ├── useAuth.tsx                  # Authentication hook
│   ├── useAttendance.tsx            # Attendance data
│   ├── useClubStatistics.tsx        # Club aggregate data
│   ├── useEmail.tsx                 # Email sending
│   ├── useEvents.tsx                # Events CRUD
│   ├── useExpenses.tsx              # Expenses CRUD
│   ├── useMessages.tsx              # Messages CRUD
│   ├── usePayments.tsx              # Payments CRUD
│   ├── useRecruiting.tsx            # Recruiting features
│   ├── useRoster.tsx                # Roster data
│   ├── useTeamResources.tsx         # Resources CRUD
│   ├── useTrips.tsx                 # Trips CRUD
│   └── useUserTeams.tsx             # User's teams
├── integrations/supabase/
│   ├── client.ts                    # Supabase client (auto-generated)
│   └── types.ts                     # Database types (auto-generated)
├── lib/
│   ├── utils.ts                     # Utility functions
│   ├── calendar-export.ts           # iCal export
│   ├── schedule-import.ts           # Schedule import parser
│   ├── demo-data.ts                 # Demo data generators
│   ├── demo-roster-data.ts          # Demo roster
│   ├── demo-stats-data.ts           # Demo statistics
│   ├── demo-team.ts                 # Demo team data
│   └── mock-travel-data.ts          # Mock travel data
├── pages/
│   ├── Landing.tsx                  # Public landing page
│   ├── Auth.tsx                     # Login/signup
│   ├── Dashboard.tsx                # Main dashboard
│   ├── CreateClub.tsx               # Club creation
│   ├── CreateTeam.tsx               # Team creation
│   ├── Schedule.tsx                 # Team schedule
│   ├── Attendance.tsx               # Attendance tracking
│   ├── Roster.tsx                   # Team roster
│   ├── Trips.tsx                    # Trip planning
│   ├── Expenses.tsx                 # Expense management
│   ├── Payments.tsx                 # Payment tracking
│   ├── Stats.tsx                    # Team/player stats
│   ├── Resources.tsx                # Team resources
│   ├── Recruiting.tsx               # Recruiting tools
│   ├── Profile.tsx                  # User profile
│   └── NotFound.tsx                 # 404 page
supabase/
├── config.toml                      # Supabase config (auto-generated)
├── functions/
│   ├── create-connect-account/      # Stripe Connect onboarding
│   ├── check-connect-status/        # Connect status check
│   ├── create-expense-payment/      # Expense payment checkout
│   ├── create-recruiting-payment/   # Recruiting payment
│   ├── send-email/                  # Transactional email
│   └── video-clip-advisor/          # AI recruiting advisor
```

---

*This document is a living specification and should be updated as features are implemented, requirements change, and customer feedback is incorporated.*

**Document History:**
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-07 | Champions Dev Team | Initial comprehensive specification |
