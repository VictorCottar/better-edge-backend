# Use uma imagem base do Node.js
FROM node:18-alpine

# Configure o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos necessários
COPY package.json package-lock.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o código fonte para o contêiner
COPY ./src ./src
COPY ./prisma ./prisma

# Gere o cliente do Prisma
RUN npx prisma generate

# Exponha a porta que o Fastify está ouvindo
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "run", "start"]
