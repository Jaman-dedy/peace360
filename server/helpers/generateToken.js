import jwt from 'jsonwebtoken';
import config from 'config';

const token = payload => {
  const generate = jwt.sign(payload, config.get('jwtSecret'), {
    expiresIn: '1day'
  });
  return {
    generate
  };
};

export default token;
