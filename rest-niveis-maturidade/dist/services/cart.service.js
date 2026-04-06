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
exports.createCartService = exports.CartService = void 0;
const Cart_1 = require("../entities/Cart");
const database_1 = require("../database");
class CartService {
    constructor(cartRepository, cartItemRepository, productRepository, customerRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }
    getCart(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.cartRepository.findOne({
                where: { uuid: uuid },
                relations: ["items.product"],
            });
        });
    }
    createCart(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            let customer = null;
            if (customerId) {
                customer = yield this.customerRepository.findOne({
                    where: { id: customerId },
                });
                if (!customer) {
                    throw new Error("Customer not found");
                }
            }
            const cart = new Cart_1.Cart();
            cart.customer = customer;
            cart.items = [];
            return this.cartRepository.save(cart);
        });
    }
    addItemToCart(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, quantity, uuid, customerId } = data;
            const where = {};
            if (uuid)
                where.uuid = uuid;
            if (customerId)
                where.customer = { id: customerId };
            let cart = Object.keys(where).length
                ? yield this.cartRepository.findOne({
                    where,
                    relations: ["items", "items.product"],
                })
                : null;
            if (!cart)
                throw new Error("Cart not found");
            const product = yield this.productRepository.findOne({
                where: { id: productId },
            });
            if (!product) {
                throw new Error("Product not found");
            }
            let cartItem = cart.items.find((item) => item.product.id === productId);
            cart = yield this.cartRepository.save(cart);
            if (cartItem) {
                cartItem.quantity += quantity;
            }
            else {
                cartItem = new Cart_1.CartItem();
                cartItem.product = product;
                cartItem.quantity = quantity;
                cartItem.cart = cart;
                cart.items.push(cartItem);
            }
            yield this.cartItemRepository.save(cartItem);
            return cart;
        });
    }
    removeItemFromCart(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uuid, cartItemId } = data;
            const cartItem = yield this.cartItemRepository.findOne({
                where: { cart: { uuid: uuid }, id: cartItemId },
            });
            if (!cartItem) {
                throw new Error("Cart item not found");
            }
            yield this.cartItemRepository.remove(cartItem);
        });
    }
    clearCart(uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = yield this.cartRepository.findOne({
                where: { uuid },
                relations: ["items.product"],
            });
            if (!cart) {
                return null;
            }
            yield this.cartItemRepository.remove(cart.items);
            cart.items = [];
            return yield this.cartRepository.save(cart);
        });
    }
}
exports.CartService = CartService;
function createCartService() {
    return __awaiter(this, void 0, void 0, function* () {
        const { cartRepository, cartItemRepository, productRepository, customerRepository, } = yield (0, database_1.createDatabaseConnection)();
        return new CartService(cartRepository, cartItemRepository, productRepository, customerRepository);
    });
}
exports.createCartService = createCartService;
