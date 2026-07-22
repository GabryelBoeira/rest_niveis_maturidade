import { Router } from "express";
import { createProductService } from "../../services/product.service";
import { Resource, ResourceCollection } from "../../http/resource";
import { NotFoundError } from "../../errors";
import { defaultCorsOptions } from "../../http/cors";
import cors from "cors";
import { LinkBuilder } from "../../http/link-builder";
import { ResourceCollectionHAL } from "../../http/resource-collection";

const router = Router();

const corsOptions = cors({
  ...defaultCorsOptions,
  methods: ["GET", "POST"],
});

const corsItem = cors({
  ...defaultCorsOptions,
  methods: ["GET", "PATCH", "DELETE"],
});

router.post("/", corsOptions, async (req, res, next) => {
  const productService = await createProductService();
  const { name, slug, description, price, categoryIds } = req.body;
  const product = await productService.createProduct(
    name,
    slug,
    description,
    price,
    categoryIds,
  );

  res.status(201);
  const resource = new Resource(
    product,
    LinkBuilder.from("/admin/products", product.id)
      .self()
      .patch()
      .delete()
      .build(),
  );
  next(resource);
});

router.get("/:productId", corsItem, async (req, res, next) => {
  const productService = await createProductService();
  const product = await productService.getProductById(
    parseInt(req.params.productId),
  );

  if (!product) {
    return next(
      new NotFoundError(
        `Product not found with the given ID ${req.params.productId}`,
      ),
    );
  }

  const resource = new Resource(
    product,
    LinkBuilder.from("/admin/products", product.id)
      .self()
      .patch()
      .delete()
      .build(),
  );
  next(resource);
});

router.patch("/:productId", corsItem, async (req, res, next) => {
  const productService = await createProductService();
  const { name, slug, description, price, categoryIds } = req.body;

  const productId = req.params.productId;
  const product = await productService.updateProduct({
    id: parseInt(productId),
    name,
    slug,
    description,
    price,
    categoryIds,
  });

  const resource = new Resource(
    product,
    LinkBuilder.from("/admin/products", productId)
      .self()
      .patch()
      .delete()
      .build(),
  );
  next(resource);
});

router.delete("/:productId", corsItem, async (req, res) => {
  const productService = await createProductService();
  const id = req.params.productId;

  await productService.deleteProduct(parseInt(id));
  res.status(204).send();
});

router.get("/", corsOptions, async (req, res, next) => {
  const productService = await createProductService();
  const {
    page = 1,
    limit = 10,
    name,
    categories_slug: categoriesSlugStr,
  } = req.query;

  const categories_slug = categoriesSlugStr
    ? categoriesSlugStr.toString().split(",")
    : [];

  const { products, total } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
      categories_slug,
    },
  });

  if (
    !req.headers["accept"] ||
    req.headers["accept"] === "*/*" ||
    req.headers["accept"] === "application/json"
  ) {
    const collection = new ResourceCollectionHAL(
      products,
      "/admin/products", // Caminho base da rota
      req.query, // Query params atuais para preservar os filtros
      {
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total,
        },
      },
    );

    return next(collection);
  }

  if (req.headers["accept"] === "text/csv") {
    const csv = products
      .map((product) => {
        return `${product.name},${product.slug},${product.description},${product.price}`;
      })
      .join("\n");

    res.set("Content-Type", "text/csv");
    res.send(csv);
  }
});

router.options("/", corsOptions);
router.options("/:productId", corsItem);

export default router;
