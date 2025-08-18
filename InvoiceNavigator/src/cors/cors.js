export const corsOptions = {
  origin: ['http://localhost:5173', 'https://invo-navigator.vercel.app'],
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}
