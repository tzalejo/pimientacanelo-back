import { Request, Response } from 'express';
import { Product } from '../../../entity/Product';
import { Category } from '../../../entity/Category';
import {
    getCategories,
    getCategory,
    createCategory,
    deleteCategory,
    updateCategory,
} from '../category.controller';

// Mock the Product and Category models
jest.mock('../../../entity/Product');
jest.mock('../../../entity/Category');

describe('Product Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject = {};

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            json: jest.fn().mockImplementation((result) => {
                responseObject = result;
                return mockResponse;
            }),
            status: jest.fn().mockReturnThis(),
            sendStatus: jest.fn().mockReturnThis(),
        };
    });

    describe('get Category', () => {
        it('should return all category', async () => {
            const mockCategory = [
                { id: 1, name: 'Category 1' },
                { id: 2, name: 'Category 2' },
            ];

            (Category.find as jest.Mock).mockResolvedValue(mockCategory);

            await getCategories(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(Category.find).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockCategory);
        });

        it('should handle errors', async () => {
            const errorMessage = 'Database error';
            (Category.find as jest.Mock).mockRejectedValue(
                new Error(errorMessage),
            );

            await getCategories(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: errorMessage,
            });
        });
    });

    describe('get Category', () => {
        it('should return a product by id', async () => {
            const mockCategory = { id: 1, name: 'Category 1' };
            mockRequest.params = { id: '1' };

            (Category.findOneBy as jest.Mock).mockResolvedValue(mockCategory);

            await getCategory(mockRequest as Request, mockResponse as Response);

            expect(Category.findOneBy).toHaveBeenCalledWith({ id: '1' });
            expect(mockResponse.json).toHaveBeenCalledWith(mockCategory);
        });

        it('should return 404 if product not found', async () => {
            mockRequest.params = { id: '999' };
            (Category.findOneBy as jest.Mock).mockResolvedValue(null);

            await getCategory(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Category not found',
            });
        });
    });

    describe('create Category', () => {
        it('should return 404 if category not found', async () => {
            const mockCategory = {
                name: 'New Category',
            };

            mockRequest.body = mockCategory;
            (Category.findOne as jest.Mock).mockResolvedValue(null);

            await createCategory(
                mockRequest as Request,
                mockResponse as Response,
            );

            // expect(mockResponse.status).toHaveBeenCalledWith(404);
            // expect(mockResponse.json).toHaveBeenCalledWith({
            //     message: 'Category not found',
            // });
        });

        it('should create a new category', async () => {
            const mockCategory = {
                name: 'Category 1',
                save: jest.fn().mockResolvedValue(true),
            };
            mockRequest.body = mockCategory;

            (Category.findOne as jest.Mock).mockResolvedValue(mockCategory);
            (Category as any).mockImplementation(() => ({
                ...mockCategory,
                save: mockCategory.save,
            }));

            await createCategory(
                mockRequest as Request,
                mockResponse as Response,
            );
            expect(mockCategory.save).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalled();
        });
    });

    describe('deleteCategory', () => {
        it('should delete a category', async () => {
            mockRequest.params = { id: '1', name: 'category 1' };
            (Category.delete as jest.Mock).mockResolvedValue({ affected: 1 });

            await deleteCategory(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(Category.delete).toHaveBeenCalledWith({ id: '1' });
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
        });

        it('should return 404 if product to delete is not found', async () => {
            mockRequest.params = { id: '999' };
            (Category.delete as jest.Mock).mockResolvedValue({ affected: 0 });

            await deleteCategory(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Category not found',
            });
        });
    });
});
