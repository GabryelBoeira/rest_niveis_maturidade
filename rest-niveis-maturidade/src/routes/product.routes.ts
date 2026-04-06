import { Router } from "express";
import { createProductService } from "../services/product.service";
import { Resource, ResourceCollection } from "../http/resource";
import { NotFoundError } from "../errors";

const router = Router();

router.get("/slug/:slug", async (req, res, next) => {
  const productService = await createProductService();
  const product = await productService.getProductBySlug(
    req.params.slug as string,
  );

  if (!product) {
    return next(
      new NotFoundError(
        `Product not found with the given slug ${req.params.slug}`,
      ),
    );
  }

  const resource = new Resource(product);
  next(resource);
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

export default router;
