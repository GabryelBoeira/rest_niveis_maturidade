import { Router } from "express";
import { createDatabaseConnection } from "../database";
import { defaultCorsOptions } from "../http/cors";
import cors from "cors";

const router = Router();

const corslogin = cors({
  ...defaultCorsOptions,
  methods: ["POST"],
});

const corsLogout = cors({
  ...defaultCorsOptions,
  methods: ["POST"],
});

router.post("/login", corslogin, async (req, res) => {
  const { email, password } = req.query;
  const { userRepository } = await createDatabaseConnection();
  const user = await userRepository.findOne({
    where: {
      email: email as string,
      password: password as string,
    },
  });
  if (user) {
    (req as any).session.userId = user.id;
    req.session.save();
    return res.send("Logged in successfully");
  }

  res.status(401).send("Invalid email or password");
});

router.post("/logout", corsLogout, async (req, res) => {
  req.session.destroy(() => {
    res.send("Logged out successfully");
  });
});

router.options("/login", corslogin);
router.options("/logout", corsLogout);

export default router;
