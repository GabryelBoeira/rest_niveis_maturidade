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
exports.createCustomerService = exports.CustomerService = void 0;
const Customer_1 = require("../entities/Customer");
const User_1 = require("../entities/User");
const database_1 = require("../database");
const errors_1 = require("../errors");
class CustomerService {
    constructor(customerRepository, userRepository) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }
    registerCustomer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, phone, address } = data;
            //check if the user already exists
            const userExists = yield this.userRepository.findOne({ where: { email } });
            if (userExists) {
                throw new errors_1.UserAlreadyExistsError("User already exists");
            }
            // Create a new user
            const user = new User_1.User();
            user.name = name;
            user.email = email;
            user.password = password;
            // Save the user
            const savedUser = yield this.userRepository.save(user);
            const customer = new Customer_1.Customer();
            customer.phone = phone;
            customer.address = address;
            customer.user = savedUser;
            return yield this.customerRepository.save(customer);
        });
    }
    updateCustomer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customerId, phone, address, password } = data;
            const customer = yield this.customerRepository.findOne({
                where: { id: customerId },
                relations: ["user"],
            });
            if (!customer)
                return null;
            if (phone)
                customer.phone = phone;
            if (address)
                customer.address = address;
            if (password) {
                const user = customer.user;
                if (password)
                    user.password = password;
                yield this.userRepository.save(user);
            }
            return yield this.customerRepository.save(customer);
        });
    }
    getCustomer(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.customerRepository.findOneBy({ id: customerId });
        });
    }
    deleteCustomer(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.customerRepository.delete({ id: customerId });
        });
    }
    listCustomers(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = data;
            const [customers, total] = yield this.customerRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
            });
            return { customers, total };
        });
    }
}
exports.CustomerService = CustomerService;
function createCustomerService() {
    return __awaiter(this, void 0, void 0, function* () {
        const { customerRepository, userRepository } = yield (0, database_1.createDatabaseConnection)();
        return new CustomerService(customerRepository, userRepository);
    });
}
exports.createCustomerService = createCustomerService;
