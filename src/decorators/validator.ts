import { HttpError } from "routing-controllers";

function ValidateArgs(test: string) {
    console.log(`Decorator called with test: ${test}`); // Called once on creation

    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            // args.forEach((arg, index) => {
            //     console.log(`Аргумент #${index + 1} = ${arg}`);
            //     console.log(`Тип аргумента #${index + 1} = ${typeof arg}`);

            //     // Init argument can be used here
            //     console.log(`Init argument ${test}`);
            //     if (typeof arg !== 'object') {
            //         throw new Error(`Аргумент №${index + 1} не является объектом!`);
            //     }
            //     console.log(Object.keys(arg).forEach((key) => {
            //         console.log(`Ключ аргумента #${index + 1} = ${key}`);
            //     }));
            // })

            if (args[0].user.length < 2) {
                throw new HttpError(400, 'User name must be at least 2 characters long');
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    }
}
export { ValidateArgs };