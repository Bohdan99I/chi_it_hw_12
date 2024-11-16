import 'reflect-metadata';
import express, { Request, Response } from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const readUsersFromFile = (): any[] => {
  const data = fs.readFileSync('./users.json', 'utf-8');
  return JSON.parse(data);
};

const writeUsersToFile = (users: any[]) => {
  fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));
};

app.get('/', (req: Request, res: Response) => {
  res.json({ author: 'Your Name' });
});

app.get('/users', (req: Request, res: Response) => {
  const users = readUsersFromFile();
  res.json(users);
});

app.post('/users', (req: Request, res: Response) => {
  const { user, email } = req.body;
  const users = readUsersFromFile();
  const newUser = {
    id: users.length + 1,
    user,
    email,
  };
  users.push(newUser);
  writeUsersToFile(users);
  res.status(201).json({ message: 'User created', newUser });
});

app.patch('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { user, email } = req.body;
  const users = readUsersFromFile();
  const userIndex = users.findIndex((u: any) => u.id == id);

  if (userIndex !== -1) {
    const updatedUser = {
      ...users[userIndex],
      ...(user && { user }),
      ...(email && { email })
    };

    users[userIndex] = updatedUser;
    writeUsersToFile(users);
    res.json({ message: 'User updated', user: updatedUser });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.delete('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const users = readUsersFromFile();
  const updatedUsers = users.filter((u: any) => u.id != id);
  if (updatedUsers.length !== users.length) {
    writeUsersToFile(updatedUsers);
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
