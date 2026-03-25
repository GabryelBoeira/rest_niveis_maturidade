import { Router } from "express";
import { createCategoryService } from "../../services/category.service";

const router = Router();

router.post("/", async (req, res) => {
  const categoryService = await createCategoryService();
  const { name, slug } = req.body;
  const category = await categoryService.createCategory({ name, slug });
  res.json(category);
});

router.get("/:categoryId", async (req, res) => {
  const categoryService = await createCategoryService();
  const category = await categoryService.getCategoryById(
    parseInt(req.params.categoryId),
  );

  res.json(category);
});

router.post("/:categoryId", async (req, res) => {
  const categoryService = await createCategoryService();
  const { name, slug } = req.body;
  const categoryId = req.params.categoryId;
  const category = await categoryService.updateCategory({
    id: parseInt(categoryId),
    name,
    slug,
  });

  res.json(category);
});

router.post("/:categoryId/delete", async (req, res) => {
  const categoryService = await createCategoryService();
  const categoryId = parseInt(req.params.categoryId);
  await categoryService.deleteCategory(categoryId);

  res.sendStatus(204);
});

router.get("/", async (req, res) => {
  const categoryService = await createCategoryService();
  const { page = 1, limit = 10, name } = req.query;
  const { categories, total } = await categoryService.listCategories({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: { name: name as string },
  });
  res.json({ categories, total });
});

export default router;
