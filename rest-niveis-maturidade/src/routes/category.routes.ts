import { Router } from "express";
import { createCategoryService } from "../services/category.service";
import { Resource, ResourceCollection } from "../http/resource";
import { NotFoundError } from "../errors";
import { defaultCorsOptions } from "../http/cors";
import cors from "cors";

const router = Router();

const corsBasePath = cors({
  ...defaultCorsOptions,
  methods: ["GET"],
});

const corsSlug = cors({
  ...defaultCorsOptions,
  methods: ["GET"],
});

const corsItem = cors({
  ...defaultCorsOptions,
  methods: ["POST"],
});

router.get("/slug/:slug", corsSlug, async (req, res, next) => {
  const categoryService = await createCategoryService();
  const category = await categoryService.getCategoryBySlug(req.params.slug);

  if (!category) {
    return next(
      new NotFoundError(
        `Category not found with the given slug ${req.params.slug}`,
      ),
    );
  }

  res.status(201);
  const resource = new Resource(category);
  next(resource);
});

router.get("/:categoryId", corsItem, async (req, res, next) => {
  const categoryService = await createCategoryService();
  const category = await categoryService.getCategoryById(
    parseInt(req.params.categoryId),
  );

  if (!category) {
    return next(
      new NotFoundError(
        `Category not found with the given ID ${req.params.categoryId}`,
      ),
    );
  }

  res.status(201);
  const resource = new Resource(category);
  next(resource);
});

router.get("/", corsBasePath, async (req, res, next) => {
  const categoryService = await createCategoryService();
  const { page = 1, limit = 10, name } = req.query;

  const { categories, total } = await categoryService.listCategories({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: { name: name as string },
  });

  const collection = new ResourceCollection(categories, {
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total,
    },
  });
  next(collection);
});

router.options("/", corsBasePath);
router.options("/slug/:slug", corsSlug);
router.options("/:categoryId", corsItem);

export default router;
