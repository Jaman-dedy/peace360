import { check } from 'express-validator';

const validateProfile = [
  check('skills', 'skills is required')
    .not()
    .isEmpty(),
];

export { validateProfile };
