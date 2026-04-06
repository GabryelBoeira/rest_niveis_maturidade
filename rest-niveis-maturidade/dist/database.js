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
exports.createDatabaseConnection = void 0;
const typeorm_1 = require("typeorm");
const Product_1 = require("./entities/Product");
const Category_1 = require("./entities/Category");
const OrderItem_1 = require("./entities/OrderItem");
const Order_1 = require("./entities/Order");
const Payment_1 = require("./entities/Payment");
const Customer_1 = require("./entities/Customer");
const User_1 = require("./entities/User");
const Cart_1 = require("./entities/Cart");
let dataSource;
function createDatabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataSource) {
            dataSource = new typeorm_1.DataSource({
                type: "sqlite",
                //database: "database.sqlite",
                database: ":memory:",
                entities: [User_1.User, Customer_1.Customer, Product_1.Product, Cart_1.Cart, Cart_1.CartItem, Category_1.Category, OrderItem_1.OrderItem, Order_1.Order, Payment_1.Payment],
                //logging: true,
                synchronize: true,
            });
            yield dataSource.initialize();
        }
        return {
            customerRepository: dataSource.getRepository(Customer_1.Customer),
            userRepository: dataSource.getRepository(User_1.User),
            productRepository: dataSource.getRepository(Product_1.Product),
            categoryRepository: dataSource.getRepository(Category_1.Category),
            orderRepository: dataSource.getRepository(Order_1.Order),
            orderItemRepository: dataSource.getRepository(OrderItem_1.OrderItem),
            cartRepository: dataSource.getRepository(Cart_1.Cart),
            cartItemRepository: dataSource.getRepository(Cart_1.CartItem),
            paymentRepository: dataSource.getRepository(Payment_1.Payment),
        };
    });
}
exports.createDatabaseConnection = createDatabaseConnection;
