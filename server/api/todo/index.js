'use strict';

import express from 'express';
import controller from './todo.controller';
import auth from '../../auth/auth.service';

var router = express.Router();

router.get('/:todolistId/todos/', auth.isAuthenticated(), controller.index);
router.get('/:todolistId/todos/:id', auth.isAuthenticated(), controller.show);
router.post('/:todolistId/todos/', auth.isAuthenticated(), controller.create);
router.put('/:todolistId/todos/:id', auth.isAuthenticated(), controller.update);
router.patch('/:todolistId/todos/:id', auth.isAuthenticated(), controller.update);
router.delete('/:todolistId/todos/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
