import { HttpError } from "routing-controllers";

interface UserData {
    user?: string;
    email?: string;
}

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function ValidateArgs(operation: 'create' | 'update') {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const userData: UserData = args[operation === 'update' ? 1 : 0];

            // Для створення користувача перевіряємо обов'язкові поля
            if (operation === 'create') {
                if (!userData.user || !userData.email) {
                    throw new HttpError(400, 'Both user and email are required for creating a user');
                }
            }

            // Перевіряємо поля, якщо вони присутні
            if (userData.user !== undefined && userData.user.length < 2) {
                throw new HttpError(400, 'User name must be at least 2 characters long');
            }

            if (userData.email !== undefined && !isValidEmail(userData.email)) {
                throw new HttpError(400, 'Invalid email format');
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    }
}
export { ValidateArgs };