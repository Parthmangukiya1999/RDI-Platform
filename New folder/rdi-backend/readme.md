## structure

- controllers - API logic
- routes - API endpoints
- middleware - auth, validation
- models - database models
- config - database, env config

## Setup Guide

1. Install Node.js(if it not installed yet)
   link - https://nodejs.org/en/download

2. Clone Project
   git clone https://dev.azure.com/your-project/seul-teams-dev/_git/seul-teams-dev

3. Install Dependencies
   cd seul-teams-dev/backend
   npm install

4. Extensions to install
   - Prettier - Code formatter
   - ESLint

5. VS Code Settings
   Press Ctrl+Shift+P

Type: "Preferences: Open user Settings (JSON)"

delete previous things there and add this:
{
"editor.formatOnSave": true,
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.codeActionsOnSave": {
"source.fixAll.eslint": "explicit"
},
"files.autoSave": "onFocusChange",
"emmet.includeLanguages": {
"javascript": "javascriptreact"
}
}

6. Test
   npm run dev

7. Daily Commands
   npm run dev # Start server
   npm run format # Format code
   npm run lint # Check quality
   npm run lint-fix # Auto-fix issues

8. Git Workflow
   git checkout -b feature/your-task-name // creates new branch
   git push origin feature/your-task-name // pushes it to the Azure DevOps to a new branch which doesn't affect main branch

9. Before committing something to the Azure DevOps, you should run this commands
   npm run dev # Start server
   npm run format # Format code
   npm run lint # Check quality
   npm run lint-fix # Auto-fix issues
   then commit everything

## commit structure

- feat: - new feature
- fix: - bug fix
- docs: - documentation changes
- style: - formatting, missing semi-colons, etc (no code change)
- refactor: - code restructuring without changing behavior
- test: - adding tests or test-related changes
- chore: - build process, tooling changes, dependencies

  example: feat: description of the feature

# API Endpoints

## Users Management

GET /api/users
Get all users

GET http://localhost:5000/api/users
GET /api/users/:id
Get specific user

GET http://localhost:5000/api/users/1
POST /api/users
Create new user

POST http://localhost:5000/api/users
Content-Type: application/json

{
"name": "Alice Gamer",
"email": "alice@example.com",
"username": "alicegamer"
}

## Authentication

POST /api/auth/login
Login user

POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
"email": "john@example.com",
"password": "password123"
}

GET /api/auth/me
Get current user profile (Protected)

GET http://localhost:5000/api/auth/me
Authorization: Bearer your_token_here

POST /api/auth/logout
Logout user

POST http://localhost:5000/api/auth/logout  
Authorization: Bearer your_token_here

Quick Testing
PowerShell Commands
Test Users:
powershell

Get all users

Invoke-RestMethod -Uri "http://localhost:5000/api/users" -Method Get

Create user

$body = '{"name":"Test User","email":"test@example.com","username":"testuser"}'
Invoke-RestMethod -Uri "http://localhost:5000/api/users" -Method Post -ContentType "application/json" -Body $body
Test Authentication:
powershell

1. Login

$login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"john@example.com","password":"password123"}'

2. Get token and test protected route

$token = $login.data.token
$headers = @{"Authorization" = "Bearer $token"}

Get profile

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method Get -Headers $headers

3. Logout

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/logout" -Method Post -Headers $headers
Test Credentials:
Email: john@example.com | Password: password123

Email: jane@example.com | Password: password123

## Teams Endpoints

- Get All Teams
  - GET /api/teams
  - GET /api/teams?game=valorant
  - GET /api/teams?search=alpha
  - GET /api/teams?skillLevel=advanced
  - GET /api/teams?region=europe

- Query Parameters:
  - game - Filter by game (exact match)

  - search - Search in team names and descriptions (partial match)

  - skillLevel - Filter by skill level (beginner, intermediate, advanced, pro)

  - region - Filter by region (partial match)

- Get Specific Team

  GET /api/teams/1

- Create New Team

  POST /api/teams
  Content-Type: application/json

  {
  "name": "Team Name",
  "game": "Game Name",
  "ownerId": 1,
  "description": "Team description",
  "maxMembers": 5,
  "skillLevel": "intermediate",
  "region": "North America",
  "tags": ["competitive", "esports"]
  }

- Update Team

  PUT /api/teams/1
  Content-Type: application/json

  {
  "description": "Updated description",
  "skillLevel": "advanced"
  }

- Delete Team

  DELETE /api/teams/1

- Join Team

  POST /api/teams/1/join
  Content-Type: application/json
  {
  "userId": 2
  }

- Complete CRUD Operations

* Create - POST /api/teams

* Read - GET /api/teams & GET /api/teams/:id

* Update - PUT /api/teams/:id

* Delete - DELETE /api/teams/:id

* Join - POST /api/teams/:id/join

* Note: Uses in-memory storage (resets on server restart)
