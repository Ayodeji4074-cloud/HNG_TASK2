const Organisation = require('../models/organisation');
const User = require('../models/user');
const { validationResult } = require('express-validator');

exports.createOrganisation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { name, description } = req.body;

  try {
    const organisation = await Organisation.create({
      name,
      description,
    });

    const user = await User.findByPk(req.user);

    await organisation.addUser(user);

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: organisation,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getOrganisations = async (req, res) => {
  try {
    const user = await User.findByPk(req.user, {
      include: Organisation
    });

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: { organisations: user.Organisations },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getOrganisationById = async (req, res) => {
  try {
    const organisation = await Organisation.findByPk(req.params.orgId, {
      include: User
    });

    if (!organisation) {
      return res.status(404).json({
        status: 'error',
        message: 'Organisation not found',
      });
    }

    const user = await User.findByPk(req.user);
    const isMember = await organisation.hasUser(user);

    if (!isMember) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation retrieved successfully',
      data: organisation,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addUserToOrganisation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { userId } = req.body;

  try {
    const organisation = await Organisation.findByPk(req.params.orgId);
    if (!organisation) {
      return res.status(404).json({
        status: 'error',
        message: 'Organisation not found',
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const owner = await User.findByPk(req.user);
    const isOwner = await organisation.hasUser(owner);

    if (!isOwner) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied',
      });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
