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
 
---
 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
 
</div>

---
 
## Overview
 
LeadFlow is a single-screen lead management tool that gives sales reps a clear picture of their pipeline at a glance. Every lead, every conversation, every follow-up — all in one place.
 
---

## Project Structure
 
```
leadflow-crm/
│
├── client/                         React frontend
│   └── src/
│       ├── components/
│       │   ├── LeadCard.jsx        individual lead row
│       │   ├── LeadList.jsx        full list with filters
│       │   ├── TimelineDialog.jsx  discussion history popup
│       │   └── AddLeadForm.jsx     new lead modal
│       ├── services/
│       │   └── api.js              all backend API calls
│       └── App.jsx
│
└── server/                         Node.js + Express backend
    ├── config/
    │   └── db.js                   MongoDB connection
    ├── models/
    │   ├── Lead.js                 lead schema
    │   └── Discussion.js           discussion schema
    ├── routes/
    │   ├── leads.js                GET · POST · PUT
    │   └── discussions.js          POST
    ├── seed/
    │   └── seed.js                 database seeder
    ├── .env.example                environment variable template
    ├── .gitignore
    └── index.js                    server entry point
```

## Getting Started
 
### Prerequisites
 
- Node.js v18 or higher
- A MongoDB Atlas account (free tier works)
---
 
### 1 — Clone the repository
 
```bash
git clone https://github.com/Vegapunk-debug/leadflow-crm.git
cd leadflow-crm
```
 
---
 
### 2 — Configure the server
 
```bash
cd server
npm install
```
 
Create a `.env` file inside `server/` using `.env.example` as reference:
 
```bash
cp .env.example .env
```
 
Fill in your values:
 
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### 3 — Start the server
 
```bash
npm run dev
```
 
API is live at `http://localhost:5000`
 
---
 
### 4 — Start the client
 
Open a new terminal:
 
```bash
cd client
npm install
npm start
```
 
App is live at `http://localhost:3000`
 
---
 ## Environment Variables
 
```bash
# server/.env.example
 
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
```
 
---
 
## AI Usage
 
This project was built with deliberate AI assistance as part of the assignment brief.
 
| Tool | How it was used |
|---|---|
| Claude (Anthropic) | Architecture planning, concept clarification, code generation, debugging |
| Cursor | In-editor AI assistance for writing and refining code |
 
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
lead         ObjectId  ref to Lead · required
note         String    required
followUp     Date      optional · defaults to null
timestamps   Auto      createdAt · updatedAt
```
 
---
 
<div align="center">
  
Built by **Rohit** · ***Es Magico Fullstack Intern Assignment*** · 2026
 
</div>
 
