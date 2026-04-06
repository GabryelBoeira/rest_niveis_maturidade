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
const cart_service_1 = require("../services/cart.service");
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartService = yield (0, cart_service_1.createCartService)();
    // @ts-expect-error
    const customerId = req.userId;
    const cart = yield cartService.createCart(customerId);
    req.session.save();
    res.json(cart);
}));
router.post("/:cartUuid/items", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartService = yield (0, cart_service_1.createCartService)();
    const uuid = req.params.cartUuid;
    const { productId, quantity } = req.body;
    // @ts-expect-error
    const customerId = req.userId;
    const cart = yield cartService.addItemToCart({
        uuid: uuid,
        customerId: customerId,
        productId: parseInt(productId),
        quantity: parseInt(quantity),
    });
    res.json({
        id: cart.id,
        items: cart.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
            },
        })),
        createdAt: cart.createdAt,
        customer: cart.customer,
    });
}));
router.get("/:cartUuid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartService = yield (0, cart_service_1.createCartService)();
    const cart = yield cartService.getCart(req.params.cartUuid);
    res.json(cart);
}));
router.delete("/:cartUuid/items/:itemId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartService = yield (0, cart_service_1.createCartService)();
    yield cartService.removeItemFromCart({
        uuid: req.params.cartUuid,
        cartItemId: parseInt(req.params.itemId),
    });
    res.send({ message: "Item removed from cart" });
}));
router.post("/:cartUuid/clear", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartService = yield (0, cart_service_1.createCartService)();
    const cart = yield cartService.clearCart(req.params.cartUuid);
    res.json(cart);
}));
exports.default = router;
