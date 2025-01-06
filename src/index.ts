import express from 'express';
import cors from 'cors';
import path from 'path';
import { upload } from './middleware/upload';
import { artistController } from './controllers/artist.controller';

const app = express();
const PORT = process.env['PORT'] || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/api/artists/:id', artistController.getOne);
app.post('/api/artists', upload.single('image'), artistController.create);
app.get('/api/artists', artistController.getAll);
app.put('/api/artists/:id', upload.single('image'), artistController.update);
app.delete('/api/artists/:id', artistController.delete);

// Nouvelles routes pour suivre et noter
app.post('/api/artists/:id/follow', artistController.followArtist);
app.post('/api/artists/:id/rate', artistController.rateArtist);

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
}); 