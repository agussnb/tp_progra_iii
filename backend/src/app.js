import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import session from 'express-session';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import sequelize from './config/database.js';

//Importaciones de enrutadores
import authRouter from './routes/auth.router.js';
import adminRouter from './routes/admin.router.js';
import productRouter from './routes/product.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'tp_progra3',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000*60*60
    } 
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000; //Cuando tenga .env se usara el puerto desde el env pero se agrega el or en caso de no tenerlo.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use('/', authRouter);
app.use('/admin', adminRouter);
app.use('/api/productos', productRouter);

async function testConnection() {
    try {
        // 1. Autentica las credenciales del .env contra MySQL
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');

        // 2. Sincroniza los modelos (Crea las tablas si no existen en tu schema tp_progra3)
        // Usamos { alter: true } para que si agregás columnas después, se actualicen solas sin borrar datos
        await sequelize.sync({ alter: true });
        console.log('🔄 Modelos de Sequelize sincronizados con la base de datos.');

    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:');
        console.error(error.message); 
        // Si la contraseña está mal, acá te va a decir: "Access denied for user 'root'@'localhost' (using password: YES)"
    }
}
testConnection();