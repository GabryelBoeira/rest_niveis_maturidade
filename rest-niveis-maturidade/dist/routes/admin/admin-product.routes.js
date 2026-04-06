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
const product_service_1 = require("../../services/product.service");
const resource_1 = require("../../http/resource");
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productService = yield (0, product_service_1.createProductService)();
    const { name, slug, description, price, categoryIds } = req.body;
    const product = yield productService.createProduct(name, slug, description, price, categoryIds);
    res.status(201);
    const resource = new resource_1.Resource(product);
    next(resource);
}));
router.get("/:productId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productService = yield (0, product_service_1.createProductService)();
    const product = yield productService.getProductById(parseInt(req.params.productId));
    if (!product) {
        return res.status(404).json({
            status: 404,
            title: "Not Found",
            message: `Product not found with the given ID ${req.params.productId}`,
        });
    }
    const resource = new resource_1.Resource(product);
    next(resource);
}));
router.patch("/:productId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const productService = yield (0, product_service_1.createProductService)();
    const { name, slug, description, price, categoryIds } = req.body;
    const productId = req.params.productId;
    const product = yield productService.updateProduct({
        id: parseInt(productId),
        name,
        slug,
        description,
        price,
        categoryIds,
    });
    const resource = new resource_1.Resource(product);
    next(resource);
}));
router.delete("/:productId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productService = yield (0, product_service_1.createProductService)();
    const id = req.params.productId;
    yield productService.deleteProduct(parseInt(id));
    res.status(204).send();
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
router.get("/products.csv", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productService = yield (0, product_service_1.createProductService)();
    const { page = 1, limit = 10, name, categories_slug: categoriesSlugStr, } = req.query;
    const categories_slug = categoriesSlugStr
        ? categoriesSlugStr.toString().split(",")
        : [];
    const { products } = yield productService.listProducts({
        page: parseInt(page),
        limit: parseInt(limit),
        filter: {
            name: name,
            categories_slug,
        },
    });
    const csv = products
        .map((product) => {
        return `${product.name},${product.slug},${product.description},${product.price}`;
    })
        .join("\n");
    res.send(csv);
}));
exports.default = router;
