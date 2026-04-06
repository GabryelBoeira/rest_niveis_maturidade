import { Router } from "express";
import { createCategoryService } from "../services/category.service";
import { Resource, ResourceCollection } from "../http/resource";
import { NotFoundError } from "../errors";

const router = Router();

router.get("/slug/:slug", async (req, res, next) => {
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

router.get("/:categoryId", async (req, res, next) => {
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

router.get("/", async (req, res, next) => {
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

export default router;
