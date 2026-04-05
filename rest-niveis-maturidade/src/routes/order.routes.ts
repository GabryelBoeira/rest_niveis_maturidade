import { Router } from "express";
import { createOrderService } from "../services/order.service";
import { Resource, ResourceCollection } from "../http/resource";

const router = Router();

router.post("/", async (req, res, next) => {
  const orderService = await createOrderService();

  // @ts-expect-error
  const customerId = req.userId;
  const { payment_method, card_token, cart_uuid } = req.body;

  const { order, payment } = await orderService.createOrder({
    customerId,
    payment_method,
    cart_uuid,
    card_token,
  });

  const resource = new Resource({ order, payment });
  next(resource);
});

router.get("/", async (req, res, next) => {
  const orderService = await createOrderService();
  const { page = 1, limit = 10 } = req.query;
  // @ts-expect-error
  const customerId = req.userId;
  const { orders, total } = await orderService.listOrders({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    customerId,
  });

  const collection = new ResourceCollection(orders, {
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total,
    },
  });
  next(collection);
});

export default router;
