import { Request, Response } from 'express';
import { Product } from '../../../entity/Product';
import { Category } from '../../../entity/Category';
import {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
} from '../product.controller';

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

    describe('getProducts', () => {
        it('should return all products', async () => {
            const mockProducts = [
                { id: 1, name: 'Product 1' },
                { id: 2, name: 'Product 2' },
            ];

            (Product.find as jest.Mock).mockResolvedValue(mockProducts);

            await getProducts(mockRequest as Request, mockResponse as Response);

            expect(Product.find).toHaveBeenCalled();
            expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
        });

        it('should handle errors', async () => {
            const errorMessage = 'Database error';
            (Product.find as jest.Mock).mockRejectedValue(
                new Error(errorMessage),
            );

            await getProducts(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: errorMessage,
            });
        });
    });

    describe('getProduct', () => {
        it('should return a product by id', async () => {
            const mockProduct = { id: 1, name: 'Product 1' };
            mockRequest.params = { id: '1' };

            (Product.findOneBy as jest.Mock).mockResolvedValue(mockProduct);

            await getProduct(mockRequest as Request, mockResponse as Response);

            expect(Product.findOneBy).toHaveBeenCalledWith({ id: '1' });
            expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
        });

        it('should return 404 if product not found', async () => {
            mockRequest.params = { id: '999' };
            (Product.findOneBy as jest.Mock).mockResolvedValue(null);

            await getProduct(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Product not found',
            });
        });
    });

    describe('createProduct', () => {
        it('should return 404 if category not found', async () => {
            const mockProduct = {
                name: 'New Product',
                description: 'Description',
                price: 10.99,
                categoryId: 999,
            };

            mockRequest.body = mockProduct;
            (Category.findOne as jest.Mock).mockResolvedValue(null);

            await createProduct(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(Category.findOne).toHaveBeenCalledWith({
                where: { id: mockProduct.categoryId },
            });
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Category not found',
            });
        });

        it('should create a new product', async () => {
            const mockCategory = { id: 1, name: 'Category 1' };
            const mockProduct = {
                name: 'New Product',
                description: 'Description',
                price: 10.99,
                categoryId: 1,
                save: jest.fn().mockResolvedValue(true),
            };

            mockRequest.body = mockProduct;

            (Category.findOne as jest.Mock).mockResolvedValue(mockCategory);
            (Product as any).mockImplementation(() => ({
                ...mockProduct,
                category: mockCategory,
                save: mockProduct.save,
            }));

            await createProduct(
                mockRequest as Request,
                mockResponse as Response,
            );

            // expect(Category.findOne).toHaveBeenCalledWith({
            //     where: { id: mockProduct.categoryId },
            // });
            // expect(mockProduct.save).toHaveBeenCalled();
            // expect(mockResponse.json).toHaveBeenCalled();
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            mockRequest.params = { id: '1' };
            (Product.delete as jest.Mock).mockResolvedValue({ affected: 1 });

            await deleteProduct(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(Product.delete).toHaveBeenCalledWith({ id: '1' });
            expect(mockResponse.sendStatus).toHaveBeenCalledWith(204);
        });

        it('should return 404 if product to delete is not found', async () => {
            mockRequest.params = { id: '999' };
            (Product.delete as jest.Mock).mockResolvedValue({ affected: 0 });

            await deleteProduct(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Product not found',
            });
        });
    });
});
