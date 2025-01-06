import { Request, Response, RequestHandler } from 'express';
import { ArtistStore } from '../models/artist.model';

export const artistController = {
    create: (async (req: Request, res: Response): Promise<void> => {
        try {
            const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
            if (!imageUrl) {
                res.status(400).json({ message: 'Image requise' });
                return;
            }

            const artist = ArtistStore.create({ ...req.body, imageUrl });
            res.status(201).json(artist);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }) as RequestHandler,

    getAll: (async (req: Request, res: Response): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            
            const { artists, total } = ArtistStore.getAll(page, limit);

            const artistsWithStats = artists.map(artist => ({
                ...artist,
                followersCount: artist.followers.length,
                averageRating: artist.averageRating || 0,
                ratingsCount: artist.ratings.length
            }));

            res.json({
                artists: artistsWithStats,
                total,
                page,
                limit
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }) as RequestHandler,

    update: (async (req: Request, res: Response): Promise<void> => {
        try {
            const updates = { ...req.body };
            if (req.file) {
                updates.imageUrl = `/uploads/${req.file.filename}`;
            }

            const artist = ArtistStore.update(req.params['id'], updates);
            if (!artist) {
                res.status(404).json({ message: 'Artiste non trouvé' });
                return;
            }

            res.json(artist);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }) as RequestHandler,

    delete: (async (req: Request, res: Response): Promise<void> => {
        try {
            const success = ArtistStore.delete(req.params['id']);
            if (!success) {
                res.status(404).json({ message: 'Artiste non trouvé' });
                return;
            }
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }) as RequestHandler,

    getOne: (async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const artist = ArtistStore.findById(id);
            
            if (!artist) {
                res.status(404).json({ message: 'Artiste non trouvé' });
                return;
            }

            const artistWithStats = {
                ...artist,
                followersCount: artist.followers.length,
                averageRating: artist.averageRating || 0,
                ratingsCount: artist.ratings.length
            };

            res.json(artistWithStats);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }) as RequestHandler,

    rateArtist: (async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { rating, userId } = req.body;

            if (rating < 1 || rating > 5) {
                res.status(400).json({ message: 'La note doit être entre 1 et 5' });
                return;
            }

            const updatedArtist = ArtistStore.addRating(id, userId, rating);
            if (!updatedArtist) {
                res.status(400).json({ message: 'Vous avez déjà noté cet artiste ou artiste non trouvé' });
                return;
            }

            res.json({
                success: true,
                averageRating: updatedArtist.averageRating,
                totalRatings: updatedArtist.ratings.length
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }) as RequestHandler,

    followArtist: (async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { userId } = req.body;

            const success = ArtistStore.followArtist(id, userId);
            if (!success) {
                res.status(400).json({ message: 'Vous suivez déjà cet artiste ou artiste non trouvé' });
                return;
            }

            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }) as RequestHandler,
}; 