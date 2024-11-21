import { Get, Param, Post, Body, JsonController, Patch, Delete } from 'routing-controllers';
import { ValidateArgs } from '../decorators/validator';
import fs from 'fs';

interface User {
    id: number;
    user: string;
    email: string;
}

const USERS_FILE = './src/users.json';

const readUsersFromFile = (): User[] => {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
};

const writeUsersToFile = (users: User[]) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

@JsonController()
export class UserController {
    @Get('/')
    getAuthor() {
        return { author: "Your Name" };
    }

    @Get('/users')
    getAll() {
        return readUsersFromFile();
    }

    @Get('/users/:id')
    getOne(@Param('id') id: number) {
        const users = readUsersFromFile();
        const user = users.find((u) => u.id === id);
        if (!user) {
            return { message: `User with ID ${id} not found` };
        }
        return user;
    }

    @Post('/users')
    @ValidateArgs('create')
    create(@Body() userData: Partial<User>) {
        const users = readUsersFromFile();
        const newUser = {
            id: users.length + 1,
            ...userData,
        } as User;
        users.push(newUser);
        writeUsersToFile(users);
        return { message: 'User created', user: newUser };
    }

    @Patch('/users/:id')
    @ValidateArgs('update')
    update(@Param('id') id: number, @Body() userData: Partial<User>) {
        const users = readUsersFromFile();
        const userIndex = users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
            return { message: `User with ID ${id} not found` };
        }
        const updatedUser = {
            ...users[userIndex],
            ...userData,
        };
        users[userIndex] = updatedUser;
        writeUsersToFile(users);
        return { message: 'User updated', user: updatedUser };
    }

    @Delete('/users/:id')
    delete(@Param('id') id: number) {
        const users = readUsersFromFile();
        const userIndex = users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
            return { message: `User with ID ${id} not found` };
        }
        users.splice(userIndex, 1);
        writeUsersToFile(users);
        return { message: 'User deleted' };
    }
}
