const express = require('express');
const messageService = require('../../services/message.service');

const router = express.Router();

async function list(req, res, next) {
  try {
    return res.json(await messageService.find(req.params));
  } catch (e) {
    next(e);
  }

  return false;
}

router.get('/', list);

module.exports = router;
