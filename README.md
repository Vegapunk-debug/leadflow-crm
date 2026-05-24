<div align="center">
  
```
  ██╗     ███████╗ █████╗ ██████╗ ███████╗██╗      ██████╗ ██╗    ██╗
  ██║     ██╔════╝██╔══██╗██╔══██╗██╔════╝██║     ██╔═══██╗██║    ██║
  ██║     █████╗  ███████║██║  ██║█████╗  ██║     ██║   ██║██║ █╗ ██║
  ██║     ██╔══╝  ██╔══██║██║  ██║██╔══╝  ██║     ██║   ██║██║███╗██║
  ███████╗███████╗██║  ██║██████╔╝██║     ███████╗╚██████╔╝╚███╔███╔╝
  ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
```

**A lightweight CRM for sales reps who move fast.**  
Track leads. Log discussions. Never miss a follow-up.

**[Live Demo](https://leadflow-crm-es-magico.vercel.app/)**  | **[Backend API](https://leadflow-crm-server.onrender.com/)**
 
---
 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
 
</div>

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
  * [Core](#core)
  * [Polish](#polish)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Option A — Docker](#option-a---docker-recommended)
  * [Option B — Local Dev](#option-b---local-dev-no-docker)
* [Environment Variables](#environment-variables)
* [REST API](#rest-api)
* [Data Models](#data-models)
* [AI Usage](#ai-usage)

---

## Overview
 
LeadFlow is a single-screen lead management tool that gives sales reps a clear picture of their pipeline at a glance. Every lead, every conversation, every follow-up — all in one place.

The UI is hand-built in a light "operator-console" style — Fraunces (display) paired with Geist (body) and JetBrains Mono (numerals), an emerald accent on paper-white surfaces, and a custom brand mark used both in the header and as the favicon.
 
---

## Features

### Core
- **Lead list** with name, company, last discussion note, time-since-last-discussion, status badge, and a tinted initials avatar per lead
- **Filter by status** — All · New · Contacted · Qualified · Proposal Sent · Won · Lost — with live counts
- **Today's follow-ups pinned** at the top of the list; **overdue follow-ups** highlighted with a red border + pill
- **Live search** by name or company (debounced)
- **Timeline dialog** opens per lead with the full discussion history (newest first)
- **Add discussion** form with optional follow-up date/time; saving updates the parent lead instantly
- **Update status** from inside the timeline dialog
- **Add new lead** modal (name required; company, phone optional; status defaults to New)
- **Delete lead** with all associated discussions

### Polish
- **KPI dashboard strip** — pipeline total, today's follow-ups, overdue count, won + win-rate
- **⌘K / Ctrl+K** focuses the search input from anywhere
- **Custom brand logo** and multi-resolution favicon
- **Optimistic UI** with revert-on-error for status changes
- **Skeleton loaders** while the list is fetching
- **Toast notifications** for success and error states
- **Responsive** down to mobile widths

---

## Project Structure
 
```
leadflow-crm/
│
├── client/                              React frontend (Create React App)
│   ├── public/
│   │   ├── favicon.svg                  brand mark (path-based, scales cleanly)
│   │   ├── favicon.ico                  multi-resolution fallback (16/32/48/64/128)
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx               wordmark + search + add button
│   │   │   ├── KpiStrip.jsx             pipeline / today / overdue / won metrics
│   │   │   ├── FilterBar.jsx            status filter tabs with counts
│   │   │   ├── LeadList.jsx             pinned + all-leads sections
│   │   │   ├── LeadCard.jsx             individual lead row with avatar
│   │   │   ├── TimelineDialog.jsx       discussion history modal
│   │   │   ├── AddLeadDialog.jsx        new lead modal
│   │   │   └── Logo.jsx                 brand SVG used in the header
│   │   ├── services/
│   │   │   └── api.js                   REST client (list/create/update/delete)
│   │   ├── utils/
│   │   │   ├── time.js                  timeAgo, formatFollowUp, isOverdue, ...
│   │   │   └── status.js                STATUSES enum + statusClass mapper
│   │   ├── App.jsx                      state orchestration
│   │   ├── index.css                    full theme (variables, layout, motion)
│   │   └── index.js                     React entry point
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
│
├── server/                              Node.js + Express + Mongoose
│   ├── config/
│   │   └── db.js                        MongoDB connection
│   ├── models/
│   │   ├── Lead.js                      lead schema + LEAD_STATUSES enum
│   │   └── Discussion.js                discussion schema
│   ├── routes/
│   │   ├── leads.js                     GET · POST · PUT · DELETE /api/leads
│   │   └── discussions.js               POST /api/discussions/:leadId
│   ├── seed/
│   │   └── seed.js                      database seeder
│   ├── index.js                         server entry point
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   └── package.json
│
├── docker-compose.yml                   one-command spin-up for both services
├── .env.example                         root env file consumed by docker-compose
├── README.md
└── LICENSE
```

---

## Getting Started

### Prerequisites

- A MongoDB Atlas cluster (free tier works) — you'll need its connection string
- **For Docker path:** Docker Desktop (or Docker Engine + Compose) installed
- **For local-dev path:** Node.js v18+

---

### Option A — Docker (recommended)

Spins up both the client and the server with one command.

```bash
git clone https://github.com/Vegapunk-debug/leadflow-crm.git
cd leadflow-crm

cp .env.example .env          # then edit .env and set MONGO_URI
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend → http://localhost:8001

To seed the database with sample leads (run once after the backend is up):

```bash
docker compose exec server npm run seed
```

---

### Option B — Local dev (no Docker)

**1.** Clone:

```bash
git clone https://github.com/Vegapunk-debug/leadflow-crm.git
cd leadflow-crm
```

**2.** Configure and start the server:

```bash
cd server
cp .env.example .env          # set MONGO_URI and (optionally) PORT
npm install
npm run seed                  # optional: load sample leads
npm run dev                   # starts on http://localhost:8001
```

**3.** In a new terminal, configure and start the client:

```bash
cd client
cp .env.example .env          # default REACT_APP_API_URL points at :8001/api
npm install
npm start                     # starts on http://localhost:3000
```

---

## Environment Variables

### `server/.env`

| Variable    | Required | Default | Description                          |
|-------------|----------|---------|--------------------------------------|
| `MONGO_URI` | yes      | —       | MongoDB Atlas connection string      |
| `PORT`      | no       | `8001`  | Port the Express server listens on   |

### `client/.env`

| Variable             | Required | Default                          | Description                          |
|----------------------|----------|----------------------------------|--------------------------------------|
| `REACT_APP_API_URL`  | no       | `http://localhost:8001/api`      | Base URL the browser uses for API calls |

### Root `.env` (used by `docker-compose`)

| Variable    | Required | Description                          |
|-------------|----------|--------------------------------------|
| `MONGO_URI` | yes      | MongoDB Atlas connection string      |

---

## REST API

Base URL: `http://localhost:8001/api`

| Method  | Endpoint                  | Body / Query                              | Description                                |
|---------|---------------------------|-------------------------------------------|--------------------------------------------|
| GET     | `/leads?status=&search=`  | optional `status`, `search`               | List leads with their discussions          |
| POST    | `/leads`                  | `{ name, company?, phone?, status? }`     | Create a lead                              |
| PUT     | `/leads/:id`              | partial Lead fields                       | Update a lead (status, follow-up, etc.)    |
| DELETE  | `/leads/:id`              | —                                         | Delete a lead and its discussions          |
| POST    | `/discussions/:leadId`    | `{ note, followUp? }`                     | Add a discussion; syncs `lead.followUp`    |

---

## Data Models

**Lead**

```
name         String    required
company      String    optional · defaults to ''
phone        String    optional · defaults to ''
status       Enum      New · Contacted · Qualified · Proposal Sent · Won · Lost · defaults to New
followUp     Date      optional · defaults to null
assignedTo   String    defaults to 'default_user'
timestamps   Auto      createdAt · updatedAt
```

**Discussion**

```
lead         ObjectId  ref to Lead · required (indexed)
note         String    required · trimmed
followUp     Date      optional · defaults to null
timestamps   Auto      createdAt · updatedAt
```

---

## AI Usage

This project was built with deliberate AI assistance as part of the assignment brief.

| Tool | How it was used |
|---|---|
| Claude (Anthropic) | Architecture planning, concept clarification, code generation, debugging, design iteration |
| Cursor | In-editor AI assistance for writing and refining code |

---

<div align="center">
  
Built by **Rohit** · ***Es Magico Fullstack Intern Assignment*** · 2026
 
</div>
