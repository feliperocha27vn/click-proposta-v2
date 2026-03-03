import { app } from './app'
import './lib/redis'

app
  .listen({
    port: 3334,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server running on http://localhost:3334')
  })
