import { Router } from "express";
import { createCartService } from "../services/cart.service";

const router = Router();

router.post("/", async (req, res) => {
  const cartService = await createCartService();
  // @ts-expect-error
  const customerId = req.userId;
  const cart = await cartService.createCart(customerId);

  req.session.save();
  res.json(cart);
});

router.post("/:cartUuid/items", async (req, res) => {
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

router.get("/:cartUuid", async (req, res) => {
  const cartService = await createCartService();
  const cart = await cartService.getCart(req.params.cartUuid);
  res.json(cart);
});

router.delete("/:cartUuid/items/:itemId", async (req, res) => {
  const cartService = await createCartService();

  await cartService.removeItemFromCart({
    uuid: req.params.cartUuid,
    cartItemId: parseInt(req.params.itemId),
  });

  res.send({ message: "Item removed from cart" });
});

router.post("/:cartUuid/clear", async (req, res) => {
  const cartService = await createCartService();
  const cart = await cartService.clearCart(req.params.cartUuid);
  res.json(cart);
});

export default router;
