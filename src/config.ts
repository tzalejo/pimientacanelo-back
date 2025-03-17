import dotenv from 'dotenv';
const envfile = dotenv.config();

if (envfile.error) {
    throw new Error('No se pudo cargar el archivo .env');
}
// Función para obtener una variable de entorno asegurando que no sea undefined
const getEnvVar = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`La variable de entorno ${key} no está definida.`);
    }
    return value;
};

export const PORT = getEnvVar('PORT');
export const DB_HOST = getEnvVar('DB_HOST');
export const DB_PORT = getEnvVar('DB_PORT');
export const DB_USERNAME = getEnvVar('DB_USERNAME');
export const DB_PASSWORD = getEnvVar('DB_PASSWORD');
export const DB_DATABASE = getEnvVar('DB_DATABASE');
export const USERNAME = getEnvVar('USERNAME');
export const USERLASTNAME = getEnvVar('USERLASTNAME');
export const PASSWORD = getEnvVar('PASSWORD');
export const EMAIL = getEnvVar('EMAIL');
export const PHONE = getEnvVar('PHONE');
