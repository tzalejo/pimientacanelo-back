import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
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
export const ADDRESS = getEnvVar('ADDRESS');

cloudinary.config({
    cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
    api_key: getEnvVar('CLOUDINARY_API_KEY'),
    api_secret: getEnvVar('CLOUDINARY_SECRET_KEY'),
});

export default cloudinary;
