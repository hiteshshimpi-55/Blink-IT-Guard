import { Router } from 'express';
import controller from "./controller";
const router:Router = Router();

// Authentication
router.post('/signup',controller.signup);
router.post("/login",controller.loginUser);
router.get("/refresh",controller.getRefreshToken);

// User Service
router.get("/user",controller.getUser);





export default router;