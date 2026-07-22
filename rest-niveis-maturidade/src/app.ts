import express, { Request, Response, NextFunction } from "express";
import { createDatabaseConnection } from "./database";
import customerRoutes from "./routes/customer.routes";
import categoryRoutes from "./routes/category.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import adminProductRoutes from "./routes/admin/admin-product.routes";
import adminCustomerRoutes from "./routes/admin/admin-customer.routes";
import adminCategoryRoutes from "./routes/admin/admin-category.routes";
import {
  ValidationError,
  UserAlreadyExistsError,
  NotFoundError,
} from "./errors";
import loginRoutes from "./routes/session-auth.routes";
import jwtAuthRoutes from "./routes/jwt-auth.routes";
import { createCustomerService } from "./services/customer.service";
import session from "express-session";
import jwt from "jsonwebtoken";
import { Resource } from "./http/resource";
import cors from "cors";
import { error } from "console";
import { url } from "inspector";
import { defaultCorsOptions } from "./http/cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (!req.headers["content-type"]) {
    return next();
  }

  const allowedTypes = [
    "application/json",
    "application/x-www-form-urlencoded",
  ];

  if (!allowedTypes.includes(req.headers["content-type"])) {
    return res.status(415).json({
      title: "Unsupported Media Type",
      status: 415,
      detail: `Content-Type must be one of: ${allowedTypes.join(", ")}`,
    });
  }

  return next();
});

app.use(async (req, res, next) => {
  const routesAllowingAlternateAccept = [
    {
      url: "/admin/products",
      method: "GET",
      accept: "text/csv",
    },
  ];

  const acceptHeader = req.headers["accept"];
  if (!acceptHeader) {
    return next();
  }

  if (acceptHeader === "application/json" || acceptHeader === "*/*") {
    return next();
  }

  const route = routesAllowingAlternateAccept.find(
    (r) =>
      r.url === req.path &&
      r.method === req.method &&
      r.accept === acceptHeader,
  );

  if (route && acceptHeader === route.accept) {
    return next();
  }

  return res.status(406).send({
    title: "Not Acceptable",
    status: 406,
    detail: `Not acceptable - ${acceptHeader}`,
  });
});

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
  }),
);

app.use(async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const origin = req.headers.origin;

  // Valida se a requisição é de uma origem permitida
  if (!origin) {
    return res.status(400).json({
      message: "Origin header is missing",
      status: 400,
      detail: "Origin header is required for CORS requests",
    });
  }

  if (!(defaultCorsOptions.origin! as string).split(",").includes(origin)) {
    return res.status(403).json({
      message: "Origin not allowed",
      status: 403,
      detail: "The requested origin is not allowed for CORS requests",
    });
  }

  next();
});

app.use(async (req, res, next) => {
  const protectedRoutes = ["/admin", "/orders"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.url.startsWith(route),
  );

  if (isProtectedRoute) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(200).send({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "123");
      (req as any).userId = Number(decoded.sub);
    } catch (e) {
      return res.status(200).send({ message: "Unauthorized" });
    }
  }

  next();
});

app.use("/auth", jwtAuthRoutes);
app.use("/session", loginRoutes);
app.use("/customers", customerRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/admin/products", adminProductRoutes);
app.use("/admin/customers", adminCustomerRoutes);
app.use("/admin/categories", adminCategoryRoutes);

app.get("/", async (req, res) => {
  await createDatabaseConnection();
  res.send("Hello World!");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (!(error instanceof Error)) {
    return next(error);
  }

  console.error(error);

  if (error instanceof ValidationError) {
    return res.status(422).json({
      title: "Unprocessable Entity",
      status: 422,
      detail: {
        errors: error.error.map((err) => ({
          property: err.property,
          constraints: err.constraints,
        })),
      },
    });
  }

  if (error instanceof UserAlreadyExistsError) {
    return res.status(409).json({
      title: "Conflict",
      status: 409,
      detail: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      title: "Not Found",
      status: 404,
      detail: error.message,
    });
  }

  res.status(500).json({
    title: "Internal Server Error",
    status: 500,
    detail: error.message,
  });
});

app.use((result: Resource, req: Request, res: Response, next: NextFunction) => {
  if (result instanceof Resource) {
    return res.json(result.toJSON());
  }
  next(result);
});

app.listen(PORT, async () => {
  const customerService = await createCustomerService();
  //create a admin user
  await customerService.registerCustomer({
    name: "admin",
    email: "admin@user.com",
    password: "admin",
    phone: "1234567890",
    address: "admin address",
  });
  //create a customer user
  await customerService.registerCustomer({
    name: "customer",
    email: "customer@user.com",
    password: "customer",
    phone: "1234567890",
    address: "customer address",
  });
  console.log(`Server is running on http://localhost:${PORT}`);
});
