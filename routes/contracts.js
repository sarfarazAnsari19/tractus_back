const express = require('express');
const router = express.Router();
const Contract = require('../models/Contract');

// Upload contract
router.post('/', async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    // Broadcast new contract to all clients
    req.app.get('broadcastUpdate')('CONTRACT_CREATED', contract);
    
    res.status(201).json(contract);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search contracts with filters and pagination
router.get('/', async (req, res) => {
  try {
    console.log("Inside contracts.js get, req.query", req.query);
    const { status, client_name, contract_id, page = 1, limit = 10 } = req.query;
    const query = { status, client_name, contract_id };
    
    const { contracts, count } = await Contract.find(query, page, limit);

    res.json({
      contracts,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    res.json(contract);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Update contract
router.put('/:id', async (req, res) => {
  try {
    const contract = await Contract.update(req.params.id, req.body);
    
    console.log("Inside contracts.js put, contract", contract);
    // Broadcast contract update to all clients
    req.app.get('broadcastUpdate')('CONTRACT_UPDATED', contract);
    
    res.json(contract);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete contract
router.delete('/:id', async (req, res) => {
  try {
    await Contract.delete(req.params.id);
    
    // Broadcast contract deletion to all clients
    req.app.get('broadcastUpdate')('CONTRACT_DELETED', { id: req.params.id });
    
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router; 