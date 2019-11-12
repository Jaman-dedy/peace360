import { check } from 'express-validator';

const validateText = [
  check('text', 'Text is required')
    .not()
    .isEmpty()
];

export { validateText };
