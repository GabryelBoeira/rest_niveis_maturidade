import { Router } from "express";
import { createCustomerService } from "../../services/customer.service";
import { Resource, ResourceCollection } from "../../http/resource";
import { NotFoundError, ValidationError } from "../../errors";
import { CreateCustomerDto } from "../../validations/customer.validations";
import { validateSync } from "class-validator";
import { Not } from "typeorm";

const router = Router();

router.post("/", async (req, res, next) => {
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

router.get("/:customerId", async (req, res, next) => {
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

router.patch("/:customerId", async (req, res, next) => {
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

router.delete("/:customerId", async (req, res) => {
  const customerService = await createCustomerService();
  const customerId = req.params.customerId;

  await customerService.deleteCustomer(parseInt(customerId));

  res.status(204).send();
});

router.get("/", async (req, res, next) => {
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

export default router;
