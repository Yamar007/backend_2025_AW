import express from 'express';
import cors from 'cors';
import { artistController } from './controllers/artist.controller';
import path from 'path';

const app = express();
const port = 3000;

// app.use(cors({
//   origin: ['http://localhost:8100', 'http://localhost:4200'],
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true,
// }));
app.use(cors({
  origin: '*', // Permet toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Toutes les méthodes HTTP nécessaires
  allowedHeaders: ['Content-Type', 'Authorization'], // Spécifiez les en-têtes nécessaires
}));
app.use(express.json());

// Ajoutez cette ligne pour servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/api/artists', artistController.getAll);
app.get('/api/artists/:id', artistController.getOne);
app.post('/api/artists', artistController.create);
app.put('/api/artists/:id', artistController.update);
app.delete('/api/artists/:id', artistController.delete);
app.post('/api/artists/:id/rate', artistController.rateArtist);
app.post('/api/artists/:id/follow', artistController.followArtist);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 