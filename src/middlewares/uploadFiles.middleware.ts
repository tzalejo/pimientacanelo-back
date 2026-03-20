import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';

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

const multerInstance = multer({ storage, limits: { fileSize: maxSize }, fileFilter });

const handleMulterError = (err: any, res: Response): boolean => {
    if (!err) return false;
    let message = 'An unknown error occurred.';
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            message = `File size exceeds the ${maxSize / (1024 * 1024)} MB limit.`;
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            message = 'Maximum 4 images allowed.';
        } else {
            message = `Multer error: ${err.message}`;
        }
    } else {
        message = err.message;
    }
    res.status(400).json({ message });
    return true;
};

// Single file upload — kept for backward compatibility
export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
    return multerInstance.single('image')(req, res, (err) => {
        if (handleMulterError(err, res)) return;
        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded. Accepted formats: .jpeg, .jpg, .png, .gif.',
            });
        }
        next();
    });
};

// Multiple files upload (max 4, at least 1 required)
export const uploadFiles = (req: Request, res: Response, next: NextFunction) => {
    return multerInstance.array('images', 4)(req, res, (err) => {
        if (handleMulterError(err, res)) return;
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required.' });
        }
        next();
    });
};

// Multiple files upload — optional (for adding images to existing products)
export const uploadFilesOptional = (req: Request, res: Response, next: NextFunction) => {
    return multerInstance.array('images', 4)(req, res, (err) => {
        if (handleMulterError(err, res)) return;
        next();
    });
};
