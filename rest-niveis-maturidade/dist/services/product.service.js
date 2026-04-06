"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductService = exports.ProductService = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("../entities/Product");
const typeorm_2 = require("typeorm");
const database_1 = require("../database");
class ProductService {
    constructor(productRepository, categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }
    createProduct(name, slug, description, price, categoryIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield this.categoryRepository.find({ where: {
                    id: (0, typeorm_2.In)(categoryIds)
                } });
            const product = new Product_1.Product();
            product.name = name;
            product.slug = slug;
            product.description = description;
            product.price = price;
            product.categories = categories;
            return yield this.productRepository.save(product);
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.findOne({ where: { id }, relations: ["categories"] });
        });
    }
    getProductBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.productRepository.findOne({ where: { slug }, relations: ["categories"] });
        });
    }
    updateProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, slug, description, price, categoryIds } = data;
            const product = yield this.productRepository.findOne({ where: { id }, relations: ["categories"] });
            if (!product) {
                return null;
            }
            if (name)
                product.name = name;
            if (slug)
                product.slug = slug;
            if (description)
                product.description = description;
            if (price)
                product.price = price;
            if (categoryIds) {
                const categories = yield this.categoryRepository.findByIds(categoryIds);
                product.categories = categories;
            }
            return yield this.productRepository.save(product);
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.productRepository.delete({ id });
        });
    }
    listProducts(data = { page: 1, limit: 10 }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, filter } = data;
            const where = {};
            if (filter === null || filter === void 0 ? void 0 : filter.name) {
                where.name = (0, typeorm_1.Like)(`%${filter.name}%`);
            }
            if ((filter === null || filter === void 0 ? void 0 : filter.categories_slug) && filter.categories_slug.length > 0) {
                where.categories = { slug: (0, typeorm_2.In)(filter.categories_slug) };
            }
            const [products, total] = yield this.productRepository.findAndCount({
                where,
                relations: ["categories"],
                skip: (page - 1) * limit,
                take: limit,
            });
            return { products, total };
        });
    }
}
exports.ProductService = ProductService;
function createProductService() {
    return __awaiter(this, void 0, void 0, function* () {
        const { productRepository, categoryRepository } = yield (0, database_1.createDatabaseConnection)();
        return new ProductService(productRepository, categoryRepository);
    });
}
exports.createProductService = createProductService;
