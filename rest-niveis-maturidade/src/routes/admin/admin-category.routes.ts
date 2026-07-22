import { Router } from "express";
import { createCategoryService } from "../../services/category.service";
import { Resource, ResourceCollection } from "../../http/resource";
import { NotFoundError } from "../../errors";
import { defaultCorsOptions } from "../../http/cors";
import cors from "cors";

const router = Router();

const corsOptions = cors({
  ...defaultCorsOptions,
  methods: ["GET", "POST"],
});

const corsItem = cors({
  ...defaultCorsOptions,
  methods: ["GET", "DELETE", "PATCH"],
});

router.post("/", corsOptions, async (req, res, next) => {
  const categoryService = await createCategoryService();
  const { name, slug } = req.body;
  const category = await categoryService.createCategory({ name, slug });

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

  const resource = new Resource(category);
  next(resource);
});

router.patch("/:categoryId", corsItem, async (req, res, next) => {
  const categoryService = await createCategoryService();
  const { name, slug } = req.body;
  const categoryId = req.params.categoryId;
  const category = await categoryService.updateCategory({
    id: parseInt(categoryId),
    name,
    slug,
  });

  const resource = new Resource(category);
  next(resource);
});

router.delete("/:categoryId", corsItem, async (req, res) => {
  const categoryService = await createCategoryService();
  const categoryId = parseInt(req.params.categoryId);

  await categoryService.deleteCategory(categoryId);

  res.status(204).send();
});

router.get("/", corsOptions, async (req, res, next) => {
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

router.options("/", corsOptions);
router.options("/:categoryId", corsItem);

export default router;
