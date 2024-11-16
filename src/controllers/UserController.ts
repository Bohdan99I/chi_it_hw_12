import { Get, Param, Post, Body, JsonController, Patch } from 'routing-controllers';
import { ValidateArgs } from '../decorators/validator';

@JsonController('/users')
export class UserController {

    @Get('/')
    getAll() {
        return [{ id: 1, name: 'John Doe 1' }, { id: 2, name: 'Jane Doe 2' }];
    }

    @Get('/:id')
    getOne(@Param('id') id: number) {
        return { id, name: `User ${id}` };
    }

    @Post('/')
    @ValidateArgs('Validation string')
    create(@Body() user: any) {
        console.log(user);
        return { message: 'User created', user };
    }

    @Patch('/:id')
    @ValidateArgs('Validation string')
    update(@Param('id') id: number, @Body() user: any) {
        console.log(id, user);
        return { message: 'User updated', user };
    }
}
