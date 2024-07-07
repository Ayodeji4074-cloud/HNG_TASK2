const express = require('express');
const { check } = require('express-validator');
const organisationController = require('../controllers/organisationController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create organisation
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
    ],
  ],
  organisationController.createOrganisation
);

// Get all organisations
router.get('/', auth, organisationController.getOrganisations);

// Get organisation by ID
router.get('/:orgId', auth, organisationController.getOrganisationById);

// Add user to organisation
router.post(
  '/:orgId/users',
  [
    auth,
    [check('userId', 'User ID is required').not().isEmpty()],
  ],
  organisationController.addUserToOrganisation
);

module.exports = router;
