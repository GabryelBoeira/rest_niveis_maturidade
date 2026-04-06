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
const product_service_1 = require("../services/product.service");
const resource_1 = require("../http/resource");
const router = (0, express_1.Router)();
router.get("/:slug", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productService = yield (0, product_service_1.createProductService)();
    const product = yield productService.getProductBySlug(req.params.slug);
    const resource = new resource_1.Resource(product);
    next(resource);
}));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productService = yield (0, product_service_1.createProductService)();
    const { page = 1, limit = 10, name, categories_slug: categoriesSlugStr, } = req.query;
    const categories_slug = categoriesSlugStr
        ? categoriesSlugStr.toString().split(",")
        : [];
    const { products, total } = yield productService.listProducts({
        page: parseInt(page),
        limit: parseInt(limit),
        filter: {
            name: name,
            categories_slug,
        },
    });
    const collection = new resource_1.ResourceCollection(products, {
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
        },
    });
    next(collection);
}));
exports.default = router;
