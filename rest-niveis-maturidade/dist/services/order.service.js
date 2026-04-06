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
exports.createOrderService = exports.OrderService = void 0;
const Order_1 = require("../entities/Order");
const OrderItem_1 = require("../entities/OrderItem");
const Payment_1 = require("../entities/Payment");
const database_1 = require("../database");
class OrderService {
    constructor(cartRepository, customerRepository, orderRepository, orderItemRepository, paymentRepository) {
        this.cartRepository = cartRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
    }
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customerId, payment_method, card_token } = data;
            const cart = yield this.cartRepository.findOne({
                where: { uuid: data.cart_uuid },
                relations: ["items", "items.product", "customer"],
            });
            if (!cart) {
                throw new Error("Cart not found");
            }
            const customer = yield this.customerRepository.findOne({
                where: { id: customerId },
            });
            if (!customer) {
                throw new Error("Customer not found");
            }
            if (!cart.customer) {
                cart.customer = customer;
                yield this.cartRepository.save(cart);
            }
            const order = new Order_1.Order();
            order.customer = customer;
            order.createdAt = new Date();
            order.orderItems = [];
            for (const cartItem of cart.items) {
                const orderItem = new OrderItem_1.OrderItem();
                orderItem.product = cartItem.product;
                orderItem.price = cartItem.product.price;
                orderItem.quantity = cartItem.quantity;
                order.orderItems.push(orderItem);
                yield this.orderItemRepository.save(orderItem);
            }
            yield this.orderRepository.save(order);
            // Clear the cart after creating the order
            cart.items = [];
            yield this.cartRepository.save(cart);
            // Attempt to pay for the order
            const payment = new Payment_1.Payment();
            payment.order = order;
            payment.method = payment_method;
            payment.amount = order.orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
            payment.status = Payment_1.PaymentStatus.PAID;
            yield this.paymentRepository.save(payment);
            return { order, payment };
        });
    }
    listOrders(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, customerId } = data;
            const where = {};
            if (customerId) {
                where.customer = { id: customerId };
            }
            const [orders, total] = yield this.orderRepository.findAndCount({
                where,
                relations: ["orderItems", "orderItems.product"],
                take: limit,
                skip: (page - 1) * limit,
            });
            return { orders, total };
        });
    }
}
exports.OrderService = OrderService;
function createOrderService() {
    return __awaiter(this, void 0, void 0, function* () {
        const { cartRepository, customerRepository, orderRepository, orderItemRepository, paymentRepository, } = yield (0, database_1.createDatabaseConnection)();
        return new OrderService(cartRepository, customerRepository, orderRepository, orderItemRepository, paymentRepository);
    });
}
exports.createOrderService = createOrderService;
