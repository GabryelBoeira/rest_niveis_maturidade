import { Router } from "express";
import { createProductService } from "../services/product.service";
import { Resource, ResourceCollection } from "../http/resource";

const router = Router();

router.get("/:slug", async (req, res, next) => {
  const productService = await createProductService();
  const product = await productService.getProductBySlug(
    req.params.slug as string,
  );

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
