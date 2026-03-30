import { Router } from "express";
import { createCustomerService } from "../../services/customer.service";

const router = Router();

router.post("/", async (req, res) => {
  const customerService = await createCustomerService();
  const { name, email, password, phone, address } = req.body;
  const customer = await customerService.registerCustomer({
    name,
    email,
    password,
    phone,
    address,
  });
  res.json(customer);
});

router.get("/:customerId", async (req, res) => {
  const customerService = await createCustomerService();
  const customer = await customerService.getCustomer(
    parseInt(req.params.customerId),
  );

  // Se o cliente não existir
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  // Se existir, envia o objeto customer
  return res.json(customer);
});

router.patch("/:customerId", async (req, res) => {
  const customerService = await createCustomerService();
  const { phone, address, password } = req.body;
  const customerId = parseInt(req.params.customerId);

  const customer = await customerService.updateCustomer({
    customerId,
    phone,
    address,
    password,
  });
  res.json(customer);
});

router.delete("/:customerId", async (req, res) => {
  const customerService = await createCustomerService();
  const customerId = req.params.customerId;

  await customerService.deleteCustomer(parseInt(customerId));

  res.send({ message: "Customer deleted successfully" });
});

router.get("/", async (req, res) => {
  const customerService = await createCustomerService();
  const { page = 1, limit = 10 } = req.query;

  const { customers, total } = await customerService.listCustomers({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
  });
  res.json({ customers, total });
});

export default router;
