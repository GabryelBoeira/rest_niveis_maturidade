import { validateSync } from "class-validator";
import { Router } from "express";
import { NotFoundError, ValidationError } from "../../errors";
import { Resource, ResourceCollection } from "../../http/resource";
import { createCustomerService } from "../../services/customer.service";
import { CreateCustomerDto } from "../../validations/customer.validations";
import { defaultCorsOptions } from "../../http/cors";
import cors from "cors";

const router = Router();

const corsOptions = cors({
  ...defaultCorsOptions,
  methods: ["GET", "POST"],
});

const corsItem = cors({
  ...defaultCorsOptions,
  methods: ["GET", "DELETE", "PATCH"],
});

router.post("/", corsOptions, async (req, res, next) => {
  const customerService = await createCustomerService();
  const { name, email, password, phone, address } = req.body;
  const validator = new CreateCustomerDto(req.body);
  const errors = validateSync(validator);

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  try {
    const customer = await customerService.registerCustomer({
      name,
      email,
      password,
      phone,
      address,
    });

    res.status(201);
    const resource = new Resource(customer);
    next(resource);
  } catch (e) {
    next(e);
  }
});

router.get("/:customerId", corsItem, async (req, res, next) => {
  const customerService = await createCustomerService();
  const customer = await customerService.getCustomer(
    parseInt(req.params.customerId),
  );

  // Se o cliente não existir
  if (!customer) {
    return next(
      new NotFoundError(
        `Customer not found with the given ID ${req.params.customerId}`,
      ),
    );
  }

  const resource = new Resource(customer);
  next(resource);
});

router.patch("/:customerId", corsItem, async (req, res, next) => {
  const customerService = await createCustomerService();
  const { phone, address, password } = req.body;
  const customerId = parseInt(req.params.customerId);

  const customer = await customerService.updateCustomer({
    customerId,
    phone,
    address,
    password,
  });

  if (!customer) {
    return next(
      new NotFoundError(
        `Customer not found with the given ID ${req.params.customerId}`,
      ),
    );
  }

  const resource = new Resource(customer);
  next(resource);
});

router.delete("/:customerId", corsItem, async (req, res) => {
  const customerService = await createCustomerService();
  const customerId = req.params.customerId;

  await customerService.deleteCustomer(parseInt(customerId));

  res.status(204).send();
});

router.get("/", corsOptions, async (req, res, next) => {
  const customerService = await createCustomerService();
  const { page = 1, limit = 10 } = req.query;

  const { customers, total } = await customerService.listCustomers({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });

  const collection = new ResourceCollection(customers, {
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total,
    },
  });
  next(collection);
});

router.options("/", corsOptions);
router.options("/:customerId", corsItem);

export default router;
