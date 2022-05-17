const express = require('express');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const {
    body: { title, url, techs },
  } = request;

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const {
    params: { id: repositoryId },
    body: updatedRepository,
  } = request;

  delete updatedRepository.likes;

  const repositoryIndex = repositories.findIndex(
    ({ id }) => id === repositoryId
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories.splice(repositoryIndex, 1, repository);

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const {
    params: { id: repositoryId },
  } = request;

  const repositoryIndex = repositories.findIndex(
    ({ id }) => id === repositoryId
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.sendStatus(204);
});

app.post('/repositories/:id/like', (request, response) => {
  const {
    params: { id: repositoryId },
  } = request;

  const repositoryIndex = repositories.findIndex(
    ({ id }) => id === repositoryId
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  const updatedRepository = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes + 1,
  };

  repositories.splice(repositoryIndex, 1, updatedRepository);

  return response.json(updatedRepository);
});

module.exports = app;
