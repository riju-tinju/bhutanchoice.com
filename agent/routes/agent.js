var express = require('express');
var router = express.Router();
var startFun = require("../helper/startingHelper")
var indexFun = require("../helper/indexHelper")
var agentFun = require("../helper/agentHelper")

/* GET agents listing page. */
router.get('/', async function (req, res, next) {
  res.render('pages/agent/listing')
});

// GET all agents with filtering, pagination, and sorting
router.get('/api/agents', async function (req, res, next) {
  await agentFun.getAgents(req, res);
});

// GET single agent by ID
router.get('/api/agents/:id', async function (req, res, next) {
  await agentFun.getAgentById(req, res);
});

// POST create new agent
router.post('/api/agents', async function (req, res, next) {
  await agentFun.createAgent(req, res);
});

// PUT update agent by ID
router.put('/api/agents/:id', async function (req, res, next) {
  await agentFun.updateAgent(req, res);
});

// DELETE agent by ID
router.delete('/api/agents/:id', async function (req, res, next) {
  await agentFun.deleteAgent(req, res);
});

module.exports = router;