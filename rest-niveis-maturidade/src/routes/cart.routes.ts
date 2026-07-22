import { Router } from "express";
import { createCartService } from "../services/cart.service";
import { defaultCorsOptions } from "../http/cors";
import cors from "cors";

const router = Router();

const corsBasePath = cors({
  ...defaultCorsOptions,
  methods: ["POST"],
});

const corsCard = cors({
  ...defaultCorsOptions,
  methods: ["POST", "GET", "DELETE"],
});

const corsItem = cors({
  ...defaultCorsOptions,
  methods: ["POST", "DELETE"],
});

router.post("/", corsBasePath, async (req, res) => {
  const cartService = await createCartService();
  // @ts-expect-error
  const customerId = req.userId;
  const cart = await cartService.createCart(customerId);

  req.session.save();
  res.json(cart);
});

router.post("/:cartUuid/items", corsItem, async (req, res) => {
  const cartService = await createCartService();
  const uuid = req.params.cartUuid;
  const { productId, quantity } = req.body;

  // @ts-expect-error
  const customerId = req.userId;

  const cart = await cartService.addItemToCart({
    uuid: uuid,
    customerId: customerId,
    productId: parseInt(productId),
    quantity: parseInt(quantity),
  });

  res.json({
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
      },
    })),
    createdAt: cart.createdAt,
    customer: cart.customer,
  });
});

router.get("/:cartUuid", corsCard, async (req, res) => {
  const cartService = await createCartService();
  const cart = await cartService.getCart(req.params.cartUuid);
  res.json(cart);
});

router.delete("/:cartUuid/items/:itemId", corsItem, async (req, res) => {
  const cartService = await createCartService();

  await cartService.removeItemFromCart({
    uuid: req.params.cartUuid,
    cartItemId: parseInt(req.params.itemId),
  });

  res.send({ message: "Item removed from cart" });
});

router.post("/:cartUuid/clear", corsCard, async (req, res) => {
  const cartService = await createCartService();
  const cart = await cartService.clearCart(req.params.cartUuid);
  res.json(cart);
});

router.options("/", corsBasePath);
router.options("/:cartUuid", corsCard);
router.options("/:cartUuid/items/:itemId", corsItem);

export default router;
