export default function errorHandler(error, req, res) {
  console.error(error);
  res.status(500).send({ error: 'Algo deu errado, tente novamente mais tarde ' + error });
}
