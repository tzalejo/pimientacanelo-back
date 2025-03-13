import app from './app';
import { PORT } from './config';
import { AppDataSource } from './db';
import { createDefaultUser } from './services/init.service';

async function main() {
    try {
        await AppDataSource.initialize();
        // para crear el usuario por defecto
        await createDefaultUser();
        app.listen(PORT);
        console.log('Server on port', PORT);
    } catch (error) {
        console.error(error);
    }
}

main();
