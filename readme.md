# Swynex Intern Task 1 — Persistent CRUD API

A REST API built with Node.js, Express, and SQLite. It preserves task records in a local database across server restarts.

## Features

- Persistent SQLite database using `better-sqlite3`
- Complete Task CRUD endpoints
- Input validation and consistent JSON error responses
- Existing health-check endpoint (`GET /health`)
- SQLite database and table are created automatically on startup

## Tech stack

- Node.js (18+ recommended)
- Express 5
- SQLite via better-sqlite3
- dotenv
- Nodemon (development)

## Setup

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd swynex-intern-task1-main
npm install
```

Copy `.env.example` to `.env` (or create `.env`) and set:

```env
PORT=3000
NODE_ENV=development
```

Start the development server:

```bash
npm run dev
```

Or run normally:

```bash
npm start
```

The API is available at `http://localhost:3000`. The database is created at `data/tasks.db` automatically. To use another path, set `DATABASE_PATH` in `.env`.

## API reference

Base path: `/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Validation

- `title` is required on create, must be a non-empty string, maximum 120 characters.
- `description` must be a string, maximum 1000 characters.
- `completed` must be a boolean (defaults to `false` on create).
- IDs must be positive integers.
- Returns `400` for invalid input, `404` when a task does not exist, and `201` on successful creation.

## Sample requests

### Create

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Finish internship assignment","description":"Implement persistent CRUD","completed":false}'
```

Example response (`201`):

```json
{
  "success": true,
  "message": "Task created.",
  "data": {
    "id": 1,
    "title": "Finish internship assignment",
    "description": "Implement persistent CRUD",
    "completed": 0,
    "created_at": "2026-11-25 14:30:00",
    "updated_at": "2026-11-25 14:30:00"
  }
}
```

### Read all

```bash
curl http://localhost:3000/api/tasks
```

### Read one

```bash
curl http://localhost:3000/api/tasks/1
```

### Update

```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Finish and submit assignment","completed":true}'
```

### Delete

```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

### Validation error example

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"   "}'
```

Example response (`400`):

```json
{
  "success": false,
  "message": "Title is required and must be a non-empty string."
}
```

## Health check

`GET /health` returns the service status and current timestamp.

## Persistence

The `data/tasks.db` SQLite file stores task records. Restarting the Node.js process does not delete records. The database file is ignored by Git; the application creates it on first startup.

## GitHub submission

After reviewing and testing locally, publish the project:

```bash
git init
git add .
git commit -m "Implement persistent SQLite CRUD API"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
git push -u origin main
```

Replace the placeholders with your actual GitHub username and repository. Submit the resulting repository URL.

## Author

Rithik R.

