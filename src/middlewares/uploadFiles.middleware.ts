import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';

// Defining storage of files
const storage = multer.diskStorage({
    filename: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void,
    ) {
        const uuid = crypto.randomUUID();
        cb(
            null,
            uuid +
            file.originalname.substring(file.originalname.lastIndexOf('.')),
        );
    },
});

// Filterting by mimetypes
const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
) => {
    const allowedFileTypes = new Set([
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/gif',
    ]);

    if (allowedFileTypes.has(file.mimetype)) {
        return cb(null, true);
    }

    return cb(null, false);
};

const maxSize = 5 * 1024 * 1024; // 5 MB

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    return multer({
        storage,
        limits: { fileSize: maxSize },
        fileFilter,
    }).single('image')(req, res, (err) => {
        // Invalid file type, message will return from fileFilter callback
        if (err) {
            let errorMessage = 'An unknown error occurred.';
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = `File size exceeds the ${maxSize / (1024 * 1024)} MB limit.`;
                } else {
                    errorMessage = `Multer error: ${err.message}`;
                }
            } else {
                errorMessage = err.message;
            }
            return res.status(400).json({ message: errorMessage });
        }

        // File not selected or incorrect format
        if (!req.file) {
            return res.status(400).json({
                message:
                    'No file has been uploaded, remember that you can only upload .jpeg, .jpg, .png and .gif formats.',
            });
        }

        // Success
        next();
    });
};
