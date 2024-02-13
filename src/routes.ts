import { Router } from "express";
import controller from "./controller";
import express, { Request, Response, NextFunction } from "express";
import hFunctions from "./hFunctions";
import multer from "multer";
import path from "path";
import fs from "fs";
const router: Router = Router();
const upload = multer({ dest: "./images" });

interface MulterRequest extends Request {
  file: any;
}
// Authentication
router.post("/signup", controller.signup);
router.post("/login", controller.loginUser);
router.get("/refresh", controller.getRefreshToken);

// User Service
router.get("/user", controller.getUser);

// Upload Image
// router.post("/upload", controller.uploadImage);

router.post("/upload", upload.single("file"), controller.uploadImage);

export default router;
