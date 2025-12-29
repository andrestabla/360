import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Generates a secure random password
 * Format: 2 uppercase + 4 lowercase + 2 numbers + 2 special chars = 10 characters
 */
export function generateSecurePassword(): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*';

    const getRandomChar = (charset: string) => charset[Math.floor(Math.random() * charset.length)];

    const password = [
        getRandomChar(uppercase),
        getRandomChar(uppercase),
        getRandomChar(lowercase),
        getRandomChar(lowercase),
        getRandomChar(lowercase),
        getRandomChar(lowercase),
        getRandomChar(numbers),
        getRandomChar(numbers),
        getRandomChar(special),
        getRandomChar(special),
    ];

    // Shuffle the array
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join('');
}

/**
 * Hashes a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}
