# JobConnect

A MERN job portal for job seekers and recruiters.

## Structure

- `frontend/` contains the requested static multi-page client, shared CSS, and browser modules.
- `backend/` contains the Express API, Mongoose models, controllers, routes, authentication middleware, and token utility.

## Run locally

1. Start MongoDB locally or set `MONGO_URI` to a hosted MongoDB connection.
2. In `backend/`, copy `.env.example` to `.env`, then run `npm install` and `npm run dev`.
3. In `frontend/`, run `npm install` and `npm run dev`, then open the Vite URL.

The API runs on `http://localhost:5000` and the frontend on `http://localhost:5173` by default.

## Contributors

- [PudiYogitha](https://github.com/PudiYogitha)
