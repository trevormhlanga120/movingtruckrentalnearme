After pushing to GitHub `main` branch the following automated actions (if configured) will make your app available online:

- Web (static): GitHub Pages will publish the built web app to the `gh-pages` branch. The URL will be:
  - https://<your-github-username>.github.io/<your-repo-name>/
  - Example: if your GitHub username is `trevor` and repo is `truck_delivery_app`, the web URL will be:
    https://trevor.github.io/truck_delivery_app/

- Container images: built images will be pushed to GitHub Container Registry (GHCR):
  - ghcr.io/<your-username>/movingtruckrentalnearme-server:latest
  - ghcr.io/<your-username>/movingtruckrentalnearme-web:latest

After images are pushed you can deploy them to any Docker-capable host (Render, DigitalOcean, AWS ECS, etc.).

Notes:
- Replace `<your-github-username>` and `<your-repo-name>` above with your GitHub account and repository name.
- If your repo is private, configure a personal access token with `repo` scope and add it as `PERSONAL_TOKEN` for the Pages deploy step.
