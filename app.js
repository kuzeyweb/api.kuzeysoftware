import express from 'express';
import cors from 'cors';
import path from 'path'
import {
    auth,
    me,
    users,
    roles,
    permissions,
    blogs,
    comments,
    pageContent,
    categories,
    contact
} from './src/routes'

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended: true
}));

app.use('/public', express.static(path.join(__dirname, 'storage')));
app.use('/api/auth', auth);
app.use('/api/me', me);
app.use('/api/users', users);
app.use('/api/roles', roles);
app.use('/api/permissions', permissions);
app.use('/api/blogs', blogs);
app.use('/api/comments', comments);
app.use('/api/pageContent', pageContent);
app.use('/api/categories', categories);
app.use('/api/contact', contact);


app.listen(5000, console.log("Server is running on PORT 5000"));