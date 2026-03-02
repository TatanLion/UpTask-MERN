import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const dbUrl = process.env.DATABASE_URL;
        
        if (!dbUrl) {
            console.error('❌ ERROR: DATABASE_URL no está definida');
            console.log('Verifica que el archivo .env existe y tiene la variable DATABASE_URL');
            process.exit(1);
        }

        console.log('🔌 Intentando conectar a MongoDB...');
        const { connection } = await mongoose.connect(dbUrl);
        console.log(`✅ Database connected: ${connection.name}: ${connection.host}:${connection.port}`);
    } catch (error) {
        console.error('❌ Database connection error:', error);
        process.exit(1);
    }
};

export default dbConnection;