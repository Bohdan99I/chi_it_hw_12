import { Get, Param, Post, Body, JsonController, Patch } from 'routing-controllers';
import { ValidateArgs } from '../decorators/validator';
import fs from 'fs';

class Tets {
    constructor() { }

    @ValidateArgs('Test string')
    test(obj: any) {
        console.log(obj);
    }
}

const USERS_FILE = './src/users.json';

const readUsersFromFile = (): any[] => {
    if (!fs.existsSync(USERS_FILE)) {
        return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
};

const writeUsersToFile = (users: any[]) => {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

@JsonController('/users')
export class UserController {
    @Get('/')
    getAll() {
        return readUsersFromFile();
    }

    @Get('/:id')
    getOne(@Param('id') id: number) {
        const users = readUsersFromFile();
        const user = users.find((u) => u.id === id);
        if (!user) {
            return { message: `User with ID ${id} not found` };
        }
        return user;
    }

    @Post('/')
    create(@Body() user: any) {
        const users = readUsersFromFile();
        const newUser = {
            id: users.length + 1,
            ...user,
        };
        users.push(newUser);
        writeUsersToFile(users); 
        return { message: 'User created', user: newUser };
    }

    @Patch('/:id')
    update(@Param('id') id: number, @Body() user: any) {
        const users = readUsersFromFile();
        const userIndex = users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
            return { message: `User with ID ${id} not found` };
        }
        const updatedUser = {
            ...users[userIndex],
            ...user,
        };
        users[userIndex] = updatedUser;
        writeUsersToFile(users);
        return { message: 'User updated', user: updatedUser };
    }
}
