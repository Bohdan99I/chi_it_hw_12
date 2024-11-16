import { HttpError } from 'routing-controllers';

function ValidateArgs(test: string) {
    console.log(`Decorator called with test: ${test}`);

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            if (args[0].user && args[0].user.length < 2) {
                throw new HttpError(400, 'User name must be at least 2 characters long');
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}

export { ValidateArgs };
