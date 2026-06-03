import express from 'express';
import session from 'express-session';
import ejs from 'ejs';
import path from 'path';;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000; //Cuando tenga .env se usara el puerto desde el env pero se agrega el or en caso de no tenerlo.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

