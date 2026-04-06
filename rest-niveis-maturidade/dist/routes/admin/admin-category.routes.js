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
const express_1 = require("express");
const category_service_1 = require("../../services/category.service");
const resource_1 = require("../../http/resource");
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryService = yield (0, category_service_1.createCategoryService)();
    const { name, slug } = req.body;
    const category = yield categoryService.createCategory({ name, slug });
    res.status(201);
    const resource = new resource_1.Resource(category);
    next(resource);
}));
router.get("/:categoryId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryService = yield (0, category_service_1.createCategoryService)();
    const category = yield categoryService.getCategoryById(parseInt(req.params.categoryId));
    const resource = new resource_1.Resource(category);
    next(resource);
}));
router.patch("/:categoryId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryService = yield (0, category_service_1.createCategoryService)();
    const { name, slug } = req.body;
    const categoryId = req.params.categoryId;
    const category = yield categoryService.updateCategory({
        id: parseInt(categoryId),
        name,
        slug,
    });
    const resource = new resource_1.Resource(category);
    next(resource);
}));
router.delete("/:categoryId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryService = yield (0, category_service_1.createCategoryService)();
    const categoryId = parseInt(req.params.categoryId);
    yield categoryService.deleteCategory(categoryId);
    res.status(204).send();
}));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryService = yield (0, category_service_1.createCategoryService)();
    const { page = 1, limit = 10, name } = req.query;
    const { categories, total } = yield categoryService.listCategories({
        page: parseInt(page),
        limit: parseInt(limit),
        filter: { name: name },
    });
    const collection = new resource_1.ResourceCollection(categories, {
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
        },
    });
    next(collection);
}));
exports.default = router;
