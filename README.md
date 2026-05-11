# AICademy Frontend

React + Vite frontend for AICademy.

## Local development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

By default, local development uses the backend at:

```text
http://localhost:8080/api/courses
```

## Environment variables

For deployment, set:

```text
VITE_API_URL=https://your-backend-url.up.railway.app/api/courses
```

## Railway deployment

Use this repo as a standalone Railway frontend project.

- Build command: `npm install && npm run build`
- Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`
- Environment variable: `VITE_API_URL=https://your-backend-url.up.railway.app/api/courses`

After Railway gives you the frontend URL, add it to the backend Railway service as:

```text
FRONTEND_URL=https://your-frontend-url.up.railway.app
```

Then redeploy the backend.
