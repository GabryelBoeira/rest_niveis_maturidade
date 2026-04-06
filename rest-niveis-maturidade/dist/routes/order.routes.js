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
const order_service_1 = require("../services/order.service");
const resource_1 = require("../http/resource");
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderService = yield (0, order_service_1.createOrderService)();
    // @ts-expect-error
    const customerId = req.userId;
    const { payment_method, card_token, cart_uuid } = req.body;
    const { order, payment } = yield orderService.createOrder({
        customerId,
        payment_method,
        cart_uuid,
        card_token,
    });
    const resource = new resource_1.Resource({ order, payment });
    next(resource);
}));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderService = yield (0, order_service_1.createOrderService)();
    const { page = 1, limit = 10 } = req.query;
    // @ts-expect-error
    const customerId = req.userId;
    const { orders, total } = yield orderService.listOrders({
        page: parseInt(page),
        limit: parseInt(limit),
        customerId,
    });
    const collection = new resource_1.ResourceCollection(orders, {
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
        },
    });
    next(collection);
}));
exports.default = router;
