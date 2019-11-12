import express from 'express';
import users from './api/users';
import auth from './api/auth';
import profile from './api/profile';
import article from './api/article';
import comment from './api/comment';
import search from './api/search';

// @ initialize app

const app = express();

//@ router configuration

app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/article', article);
app.use('/api/comment', comment);
app.use('/api/search', search);

export default app;
