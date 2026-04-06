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
exports.createCategoryService = exports.CategoryService = void 0;
const typeorm_1 = require("typeorm");
const Category_1 = require("../entities/Category");
const database_1 = require("../database");
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, slug } = data;
            const category = new Category_1.Category();
            category.name = name;
            category.slug = slug;
            return yield this.categoryRepository.save(category);
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.findOne({ where: { id } });
        });
    }
    getCategoryBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.findOne({ where: { slug } });
        });
    }
    updateCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, slug } = data;
            const category = yield this.categoryRepository.findOne({ where: { id } });
            if (!category)
                return null;
            if (name)
                category.name = name;
            if (slug)
                category.slug = slug;
            return yield this.categoryRepository.save(category);
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.categoryRepository.delete({ id });
        });
    }
    listCategories(data = { page: 1, limit: 10 }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, filter } = data;
            const where = {};
            if (filter === null || filter === void 0 ? void 0 : filter.name) {
                where.name = (0, typeorm_1.Like)(`%${filter.name}%`);
            }
            const [categories, total] = yield this.categoryRepository.findAndCount({
                where,
                skip: (page - 1) * limit,
                take: limit,
            });
            return { categories, total };
        });
    }
}
exports.CategoryService = CategoryService;
function createCategoryService() {
    return __awaiter(this, void 0, void 0, function* () {
        const { categoryRepository } = yield (0, database_1.createDatabaseConnection)();
        return new CategoryService(categoryRepository);
    });
}
exports.createCategoryService = createCategoryService;
