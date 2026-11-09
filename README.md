# GODAVARI RAKSHA (గోదావరి రక్ష)

**AI-Powered Smart Pilgrim Safety, Emergency Response & Disaster Management Ecosystem**  
**Godavari Pushkaralu 2027**  
*Organized by Rajamahendravaram Municipal Corporation (RMC) & Ratan Tata Innovation Hub (RTIH)*  
*Problem Statement: PS-02 – Emergency Detection, Public Safety and Response Coordination*  

---

## Overview

**GODAVARI RAKSHA** is an enterprise-grade smart-city public-safety platform built specifically for the Godavari Pushkaralu 2027 festival in Rajamahendravaram. When millions of pilgrims gather along the Godavari riverbanks, traditional paper-based or siloed emergency tools fail. Godavari Raksha bridges the gap by linking pilgrims, frontline responders, municipal authorities, hospital trauma teams, and disaster command centers into a unified, intelligent safety network.

## Key Architecture & Technologies

1. **Frontend**: React 19 + TypeScript + Tailwind CSS v4.
2. **Backend**: Node.js + Express with server-side Vite middlewares in dev mode.
3. **Artificial Intelligence**: Multimodal Gemini 3.8 Flash (`@google/genai`) for CCTV optical analysis, multilingual copilot, and control-room tactical decision support.
4. **3D Digital Twin**: Procedural Three.js WebGL simulation representing the riverfront, stone ghats, Havelock rail bridge, and flood surges.
5. **GIS Emergency Map**: Leaflet + OpenStreetMap geo-coordinate mapping of 8 ghats, 12 squads, and medical camps.
6. **Data Storage & Real-Time Sync**: Typed database architecture with instant synthetic baseline reset.

## Quick Start Instructions

1. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Opens on `http://localhost:3000`.

2. **Run TypeScript Verification**:
   ```bash
   npm run lint
   ```

3. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## Demo Roles Switcher

In the top navigation bar, use the role switcher button to switch between:
- **Super Administrator** (`admin@godavariraksha.gov.in`)
- **Emergency Control-Room Operator** (`operator@godavariraksha.gov.in`)
- **Police Personnel** (`police@godavariraksha.gov.in`)
- **Ambulance & Medical Teams** (`medical@godavariraksha.gov.in`)
- **Fire & River Rescue Teams** (`rescue@godavariraksha.gov.in`)
- **Pilgrim User** (`pilgrim@godavariraksha.gov.in`)
