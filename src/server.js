import fastify from "fastify";
import cors from '@fastify/cors';
import routes from './routes.js';  

const app = fastify();

app.register(cors, { origin: '*' });

routes(app);

app.listen({ host: '0.0.0.0', port: 3000 }, () => {
  console.log("Servidor rodando em http://localhost:3000");
});