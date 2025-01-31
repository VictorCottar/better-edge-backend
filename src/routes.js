import { PrismaClient } from "@prisma/client";
import errorHandler from './middlewares/errorHandler.js';

const prisma = new PrismaClient();

export default function routes(app) {

  app.setErrorHandler(errorHandler);

  // rota teste 
  app.get('/', (req, res) => {
    res.send('API está funcionando!');
  });

  // rota para criar um novo cliente
  app.post('/clientes', async (req, res) => {
    const { nome, email } = req.body;

    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        status: true,
      },
      include: {
        ativos: true,
      },
    });

    res.status(201).send(cliente);

  });

  // rota para listar todos os clientes
  app.get('/clientes', async (req, res) => {
    const clientes = await prisma.cliente.findMany({
      include: {
        ativos: true // Isso inclui todos os ativos relacionados
      },
      orderBy: {
        id: 'desc'
      }
    });
    return res.status(200).send(clientes);
  });

  // rota para deletar clientes
  app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;

    await prisma.cliente.delete({
      where: {
        id: parseInt(id)
      }
    });

    return res.status(200).send({ sucess: 'Cliente deletado com sucesso' });

  })

  // rota para atualizar um cliente
  app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;

    const cliente = await prisma.cliente.update({
      where: {
        id: parseInt(id)
      },
      data: {
        nome,
        email,
      },
      include: {
        ativos: true
      }
    });

    return res.status(200).send(cliente);

  });

  // rota para inativar cliente
  app.put('/clientes/inativar/:id', async (req, res) => {
    const { id } = req.params;

    const cliente = await prisma.cliente.update({
      where: {
        id: parseInt(id)
      },
      data: {
        status: false,
      },
      include: {
        ativos: true
      }
    });

    return res.status(200).send(cliente);

  });

  // rota para adicionar ativo no cliente
  app.put('/clientes/:id/ativos', async (req, res) => {
    const { id } = req.params;
    const { ativoId } = req.body;

    const cliente = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: {
        ativos: {
          connect: { id: parseInt(ativoId) }
        }
      },
      include: {
        ativos: true // Inclui os ativos atualizados na resposta
      }
    });

    return res.status(200).send(cliente);
  });

  // rota para criar um novo ativo para cliente
  app.post('/ativos/:id', async (req, res) => {
    const { nome, valorAtual, clienteId } = req.body;

    const ativo = await prisma.ativos.create({
      data: {
        nome,
        valorAtual,
        cliente: {
          connect: {
            id: clienteId
          }
        }
      }
    });

    return res.status(201).send(ativo);

  })

  // rota para criar ativos
  app.post('/ativos', async (req, res) => {
    const { nome, valorAtual, clienteId } = req.body;

    const ativoData = {
      nome,
      valorAtual,
    };

    if (clienteId) {
      ativoData.cliente = {
        connect: {
          id: clienteId,
        },
      };
    }

    const ativo = await prisma.ativos.create({
      data: ativoData,
    });

    return res.status(201).send(ativo);

  })

  // rota para deletar ativos
  app.delete('/ativos/:id', async (req, res) => {
    const { id } = req.params;

    await prisma.ativos.delete({
      where: {
        id: parseInt(id)
      }
    });

    return res.status(200).send({ sucess: 'Ativo deletado com sucesso' });

  })

  // rota para listar todos os ativos
  app.get('/ativos', async (req, res) => {

    const ativos = await prisma.ativos.findMany({
      orderBy: {
        id: 'desc',
      },
    });

    return res.status(200).send(ativos);

  })
}