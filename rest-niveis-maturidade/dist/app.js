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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const admin_product_routes_1 = __importDefault(require("./routes/admin/admin-product.routes"));
const admin_customer_routes_1 = __importDefault(require("./routes/admin/admin-customer.routes"));
const admin_category_routes_1 = __importDefault(require("./routes/admin/admin-category.routes"));
const errors_1 = require("./errors");
const session_auth_routes_1 = __importDefault(require("./routes/session-auth.routes"));
const jwt_auth_routes_1 = __importDefault(require("./routes/jwt-auth.routes"));
const customer_service_1 = require("./services/customer.service");
const express_session_1 = __importDefault(require("express-session"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const resource_1 = require("./http/resource");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
}));
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const protectedRoutes = ["/admin", "/orders"];
    const isProtectedRoute = protectedRoutes.some((route) => req.url.startsWith(route));
    if (isProtectedRoute) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(200).send({ message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(token, "123");
            req.userId = Number(decoded.sub);
        }
        catch (e) {
            return res.status(200).send({ message: "Unauthorized" });
        }
    }
    next();
}));
app.use("/auth", jwt_auth_routes_1.default);
app.use("/session", session_auth_routes_1.default);
app.use("/customers", customer_routes_1.default);
app.use("/categories", category_routes_1.default);
app.use("/products", product_routes_1.default);
app.use("/cart", cart_routes_1.default);
app.use("/orders", order_routes_1.default);
app.use("/admin/products", admin_product_routes_1.default);
app.use("/admin/customers", admin_customer_routes_1.default);
app.use("/admin/categories", admin_category_routes_1.default);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.createDatabaseConnection)();
    res.send("Hello World!");
}));
app.use((error, req, res, next) => {
    console.error(error);
    if (error instanceof errors_1.ValidationError) {
        return res.status(422).json({
            title: "Unprocessable Entity",
            status: 422,
            detail: {},
        });
    }
    if (error instanceof errors_1.UserAlreadyExistsError) {
        return res.status(409).json({
            title: "Conflict",
            status: 409,
            detail: error.message,
        });
    }
    if (error instanceof Error) {
        return res.json({ error: error.message });
    }
    return res.json({ error: "Unknown error" });
});
app.use((result, req, res, next) => {
    if (result instanceof resource_1.Resource) {
        return res.json(result.toJSON());
    }
    next(result);
});
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    const customerService = yield (0, customer_service_1.createCustomerService)();
    //create a admin user
    yield customerService.registerCustomer({
        name: "admin",
        email: "admin@user.com",
        password: "admin",
        phone: "1234567890",
        address: "admin address",
    });
    //create a customer user
    yield customerService.registerCustomer({
        name: "customer",
        email: "customer@user.com",
        password: "customer",
        phone: "1234567890",
        address: "customer address",
    });
    console.log(`Server is running on http://localhost:${PORT}`);
}));
