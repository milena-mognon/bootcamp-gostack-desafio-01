const express = require('express');

const server = express();

server.use(express.json());

/**
 * MIDDLEWARE
 */

/**
 * Middleware Global
 */
server.use((req, res, next) => {
  console.count("");
  next();
});

/**
 * Middleware Local
 */
function verifyProjectExist(req, res, next) {
  const project = projects.find(item => item.id == req.params.id);
  if (!project) {
    return res.status(400).json({
      error: 'Project does not exist!'
    });
  }
  req.project = project;
  return next();
}

function validateProjectData(req, res, next) {
  const { id, title } = req.body;
  if (!id || !title) {
    return res.status(400).json({
      error: 'Incomple data. Should have id and title.'
    });
  }
  return next();
}

const projects = [];

// CRUD

// Listar Projetos
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Cadastrar Projetos
server.post('/projects', validateProjectData, (req, res) => {
  const { id, title } = req.body;
  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

// Buscar o projeto pelo id
server.get('/projects/:id', verifyProjectExist, (req, res) => {
  const { id } = req.params;

  // Utilizado a função find() pois retorna diretamente o valor
  // poderia ser utilizado findIndex para retorna a posição
  const project = projects.find(item => item.id == id);

  return res.json(project);
});

// Editar projeto
server.put('/projects/:id', verifyProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  // encontra o projeto
  const project = projects.find(item => item.id == id);

  // modifica a propriedade title através de mutação
  project.title = title;

  return res.json(projects);

});

server.delete('/projects/:id', verifyProjectExist, (req, res) => {
  const { id } = req.params;

  // encontra o index do projeto
  const project = projects.findIndex(item => item.id == id);

  // percorre o array até o index e remove a quantidade indicada
  // como foi passado o valor 1 é removido apenas o valor presente naquele index
  projects.splice(project, 1);

  return res.json({ message: "Deletado com Sucesso!" });
});

server.post('/projects/:id/tasks', verifyProjectExist, (req, res) => {
  const { title } = req.body;

  // const project = projects.find(item => item.id == id);

  // como passou pelo middleware é possível acessar o projeto com req.project
  req.project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);

