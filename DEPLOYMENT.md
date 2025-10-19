# Deployment guide

This project (MovingTruckRentalNearMe) includes simple Docker artifacts and a docker-compose file to run the server and web build locally, plus notes for deploying to common providers.

Quick local test (requires Docker and docker-compose):

1. Build and start both services:

```bash
docker-compose build --no-cache
docker-compose up -d
```

2. Server will be available at http://localhost:3333
3. Web (static) will be available at http://localhost:8080

Notes for production

- Server: any provider that supports Node.js or Docker can run `server/Dockerfile`. On Render/Heroku, set start command to `npm start` and set env vars in the UI.
- Web: builds to `web-build/` using `npm run build:web` (this uses `expo build:web`). The static output can be served from any static host (Vercel, Netlify, S3+CloudFront) or via the included `Dockerfile.web` + nginx.

Environment variables

See `server/.env.example` for variables required by the server (SMTP, GOOGLE_API_KEY). Add values in your host or `server/.env` locally.

CI/CD

- To push Docker images, add a GitHub Action that runs `docker build` and pushes to your registry; set registry secrets in the repo.
- Alternatively, connect your GitHub repo directly to Render or Railway and add the build/start commands described above.
