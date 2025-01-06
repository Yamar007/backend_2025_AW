interface Rating {
    userId: string;
    value: number;
    date: Date;
}

interface Artist {
    id: string;
    name: string;
    stageName: string;
    imageUrl: string;
    label: string;
    publisher: string;
    careerStartDate: Date;
    ratings: Rating[];
    followers: string[];  // IDs des utilisateurs qui suivent
    averageRating?: number;
}

// Stockage en mémoire
export class ArtistStore {
    private static artists: Artist[] = [];

    static getAll(page: number = 1, limit: number = 10) {
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            artists: this.artists.slice(start, end),
            total: this.artists.length
        };
    }

    static create(artist: Omit<Artist, 'id' | 'ratings' | 'followers' | 'averageRating'>) {
        const newArtist: Artist = {
            ...artist,
            id: crypto.randomUUID(),
            ratings: [],
            followers: [],
            averageRating: 0
        };
        this.artists.push(newArtist);
        return newArtist;
    }

    static update(id: string, updates: Partial<Artist>) {
        const index = this.artists.findIndex(a => a.id === id);
        if (index === -1) return null;

        this.artists[index] = { ...this.artists[index], ...updates };
        return this.artists[index];
    }

    static delete(id: string) {
        const index = this.artists.findIndex(a => a.id === id);
        if (index === -1) return false;

        this.artists.splice(index, 1);
        return true;
    }

    static findById(id: string) {
        return this.artists.find(a => a.id === id);
    }

    static addRating(artistId: string, userId: string, rating: number): Artist | null {
        const artist = this.findById(artistId);
        if (!artist) return null;

        // Vérifier si l'utilisateur a déjà noté
        const existingRating = artist.ratings.find(r => r.userId === userId);
        if (existingRating) {
            return null; // Un utilisateur ne peut pas noter 2 fois
        }

        // Ajouter la nouvelle note
        artist.ratings.push({ userId, value: rating, date: new Date() });
        
        // Calculer la moyenne
        artist.averageRating = this.calculateAverageRating(artist.ratings);
        
        return artist;
    }

    static followArtist(artistId: string, userId: string): boolean {
        const artist = this.findById(artistId);
        if (!artist) return false;

        if (!artist.followers.includes(userId)) {
            artist.followers.push(userId);
            return true;
        }
        return false;
    }

    private static calculateAverageRating(ratings: Rating[]): number {
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((acc, rating) => acc + rating.value, 0);
        return sum / ratings.length;
    }
} 