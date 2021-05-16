import dotenv from 'dotenv'
import express from 'express'
import { AddressInfo } from "net";
import { createRecipe } from './endpoints/CreateRecipe';
import { createUser } from './endpoints/CreateUser';
import { followUser } from './endpoints/FollowUser';
import { getProfile } from './endpoints/GetProfile';
import { getRecipe } from './endpoints/GetRecipe';
import { userFeed } from './endpoints/UserFeed';
import { getUserProfile } from './endpoints/GetUserProfile';
import { login } from './endpoints/Login';
import { unFollowUser } from './endpoints/UnfollowUser';
import { deleteRecipe } from './endpoints/DeleteRecipe';
import { editRecipe } from './endpoints/EditRecipe';
import { deleteUser } from './endpoints/DeleteUser';

dotenv.config();

const app = express();

app.use(express.json());

const server = app.listen(process.env.DB_PORT || 3003, () => {
    if (server) {
        const address = server.address() as AddressInfo;
        console.log(`Server is running in http://localhost:${address.port}`);
    } else {
        console.error(`Failure upon starting server.`);
    }
});

app.post('/signup', createUser)
app.post('/login', login)
app.delete('/user/delete', deleteUser)
app.get('/user/profile', getProfile)
app.get('/user/feed', userFeed)
app.post('/user/follow', followUser)
app.post('/user/unfollow', unFollowUser)
app.get('/user/:id', getUserProfile)
app.post('/recipe', createRecipe)
app.put('/recipe/edit', editRecipe)
app.delete('/recipe/delete', deleteRecipe)
app.get('/recipe/:id', getRecipe)