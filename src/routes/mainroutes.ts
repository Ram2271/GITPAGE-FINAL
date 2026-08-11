import { Router } from 'express';
import multer from 'multer';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3, BUCKET_NAME } from '../config/storage';
import Game from '../models/GameModel';

const router = Router();

// Configure multer to use memory storage instead of saving files to a local folder
const upload = multer({ storage: multer.memoryStorage() });

// Get all published games
router.get('/api/games', async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 });
        res.json(games);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});

// Upload game details and file directly to Backblaze B2
router.post('/upload', upload.single('apkFile'), async (req: any, res: any) => {
    try {
        const { title, description, developerName, webGameUrl } = req.body;
        let apkFileName = '';

        if (req.file) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            apkFileName = `${uniqueSuffix}-${req.file.originalname}`;

            const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: apkFileName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype
            };

            // Stream file straight into Backblaze cloud
            await s3.send(new PutObjectCommand(uploadParams));
        }

        const newGame = new Game({
            title,
            description,
            developerName,
            webGameUrl,
            apkFileName
        });

        await newGame.save();
        res.status(201).json({ message: 'Game published successfully!' });
    } catch (err: any) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message || 'Failed to upload game' });
    }
});

// Stream download directly from Backblaze B2 cloud storage
router.get('/download/:filename', async (req: any, res: any) => {
    try {
        const filename = req.params.filename;
        const getParams = {
            Bucket: BUCKET_NAME,
            Key: filename
        };

        const data = await s3.send(new GetObjectCommand(getParams));

        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        if (data.ContentType) {
            res.setHeader('Content-Type', data.ContentType);
        }

        // Pipe the cloud storage stream straight to the user's browser
        (data.Body as any).pipe(res);
    } catch (err) {
        console.error('Download error:', err);
        res.status(404).send('File not found on cloud storage.');
    }
});

export default router;