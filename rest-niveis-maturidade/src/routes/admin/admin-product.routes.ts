import { Router } from "express";
import { createProductService } from "../../services/product.service";
import { Resource, ResourceCollection } from "../../http/resource";
import { NotFoundError } from "../../errors";

const router = Router();

router.post("/", async (req, res, next) => {
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
  const resource = new Resource(product);
  next(resource);
});

router.get("/:productId", async (req, res, next) => {
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

    res.status(404).json({
      status: 404,
      title: "Not Found",
      message: `Product not found with the given ID ${req.params.productId}`,
    });
  }

  const resource = new Resource(product);
  next(resource);
});

router.patch("/:productId", async (req, res, next) => {
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

  const resource = new Resource(product);
  next(resource);
});

router.delete("/:productId", async (req, res) => {
  const productService = await createProductService();
  const id = req.params.productId;

  await productService.deleteProduct(parseInt(id));
  res.status(204).send();
});

router.get("/", async (req, res, next) => {
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

  const collection = new ResourceCollection(products, {
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total,
    },
  });
  next(collection);
});

router.get("/products.csv", async (req, res) => {
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

  const { products } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
      categories_slug,
    },
  });
  const csv = products
    .map((product) => {
      return `${product.name},${product.slug},${product.description},${product.price}`;
    })
    .join("\n");
  res.send(csv);
});

export default router;
