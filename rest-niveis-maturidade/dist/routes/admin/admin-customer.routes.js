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
const customer_service_1 = require("../../services/customer.service");
const resource_1 = require("../../http/resource");
const errors_1 = require("../../errors");
const customer_validations_1 = require("../../validations/customer.validations");
const class_validator_1 = require("class-validator");
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerService = yield (0, customer_service_1.createCustomerService)();
    const { name, email, password, phone, address } = req.body;
    const validator = new customer_validations_1.CreateCustomerDto(req.body);
    const errors = (0, class_validator_1.validateSync)(validator);
    if (errors.length > 0) {
        return next(new errors_1.ValidationError(errors));
    }
    try {
        const customer = yield customerService.registerCustomer({
            name,
            email,
            password,
            phone,
            address,
        });
        res.status(201);
        const resource = new resource_1.Resource(customer);
        next(resource);
    }
    catch (e) {
        next(e);
    }
}));
router.get("/:customerId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerService = yield (0, customer_service_1.createCustomerService)();
    const customer = yield customerService.getCustomer(parseInt(req.params.customerId));
    // Se o cliente não existir
    if (!customer) {
        return res.status(404).json({
            status: 404,
            title: "Not Found",
            message: `Customer not found with the given ID ${req.params.customerId}`,
        });
    }
    const resource = new resource_1.Resource(customer);
    next(resource);
}));
router.patch("/:customerId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerService = yield (0, customer_service_1.createCustomerService)();
    const { phone, address, password } = req.body;
    const customerId = parseInt(req.params.customerId);
    const customer = yield customerService.updateCustomer({
        customerId,
        phone,
        address,
        password,
    });
    if (!customer) {
        return res.status(404).json({
            status: 404,
            title: "Not Found",
            message: `Customer not found with the given ID ${req.params.customerId}`,
        });
    }
    const resource = new resource_1.Resource(customer);
    next(resource);
}));
router.delete("/:customerId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const customerService = yield (0, customer_service_1.createCustomerService)();
    const customerId = req.params.customerId;
    yield customerService.deleteCustomer(parseInt(customerId));
    res.status(204).send();
}));
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerService = yield (0, customer_service_1.createCustomerService)();
    const { page = 1, limit = 10 } = req.query;
    const { customers, total } = yield customerService.listCustomers({
        page: parseInt(page),
        limit: parseInt(limit),
    });
    const collection = new resource_1.ResourceCollection(customers, {
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
        },
    });
    next(collection);
}));
exports.default = router;
