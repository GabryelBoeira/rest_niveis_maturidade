import { Router } from "express";
import { createProductService } from "../services/product.service";
import { Resource, ResourceCollection } from "../http/resource";
import { NotFoundError } from "../errors";
import { defaultCorsOptions } from "../http/cors";
import cors from "cors";

const router = Router();

const corsBasePath = cors({
  ...defaultCorsOptions,
  methods: ["GET"],
});

const corsSlugPath = cors({
  ...defaultCorsOptions,
  methods: ["GET"],
});

router.get("/slug/:slug", corsSlugPath, async (req, res, next) => {
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

router.get("/", corsBasePath, async (req, res, next) => {
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

router.options("/", corsBasePath);
router.options("/slug/:slug", corsSlugPath);

export default router;
