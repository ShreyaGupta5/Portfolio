# Portfolio

Full-stack personal portfolio for Shreya Gupta. The Node.js + Express backend serves the static frontend and provides a same-domain contact API, so the deployed site opens from one Render URL.

## Structure

```text
portfolio-fullstack/
+-- frontend/
|   +-- index.html
|   +-- css/style.css
|   +-- js/script.js
|   +-- assets/
|   +-- projects/
+-- backend/
|   +-- server.js
|   +-- package.json
|   +-- routes/contactRoutes.js
|   +-- controllers/contactController.js
+-- package.json
+-- render.yaml
```

## Local Run

```bash
npm install
npm run build
npm start
```

Open:

```text
http://localhost:5000
```

The contact API runs at:

```text
POST /api/contact
GET  /api/contact
GET  /api/health
```

## Render Deployment

Create a Render Web Service from this repository.

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```

The frontend and backend are served from the same Render domain. The contact form posts to `/api/contact`, so no localhost API URL is needed in production.
