import { validateSync } from "class-validator";
import cors from "cors";
import { Router } from "express";
import { ValidationError } from "../errors";
import { defaultCorsOptions } from "../http/cors";
import { Resource } from "../http/resource";
import { createCustomerService } from "../services/customer.service";
import { CreateCustomerDto } from "../validations/customer.validations";

const router = Router();

const corsBasePath = cors({
  ...defaultCorsOptions,
  methods: ["POST"],
});

router.post("/", async (req, res, next) => {
  const customerService = await createCustomerService();
  const validator = new CreateCustomerDto(req.body);
  const errors = validateSync(validator);

  if (errors.length > 0) {
    return next(new ValidationError(errors));
  }

  const { name, email, password, phone, address } = req.body;
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

router.options("/", corsBasePath);

export default router;
