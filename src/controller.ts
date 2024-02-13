import { Request, Response } from "express";
import hfunction from "./hFunctions";
import utils from "./utils";
import path from "path";
import hFunctions from "./hFunctions";

interface MulterRequest extends Request {
  file: any;
}

const signup = async (req: Request, res: Response) => {
  const { user_id, password, email } = req.body;

  try {
    // Check if the user already exists in the database
    const existingUser = await hfunction.getUserById(user_id);
    if (existingUser) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    // Hash the password
    const hashedPassword = await hfunction.hashedPassword(password);

    // Create a new user in the database
    await hfunction.createUser(user_id, hashedPassword, email);

    // Generate access and refresh tokens
    const accessToken = hfunction.generateToken({ user_id }, true);
    const refreshToken = hfunction.generateToken({ user_id }, false);

    res.status(200).send({
      message: "User signed up successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { user_id, password } = req.body;

  try {
    const user = await hfunction.getUserById(user_id);

    if (!user) {
      return res.status(401).send({ message: "Invalid user credentials" });
    }

    const isPasswordValid = await hfunction.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid user credentials" });
    }

    const accessToken = hfunction.generateToken({ user_id }, true);
    const refreshToken = hfunction.generateToken({ user_id }, false);

    res.status(200).send({
      message: "User logged in successfully",
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const header = req.headers["authorization"];
    const token = header.split(" ")[1];
    console.log(`token received : ${token}`);

    const userId = hfunction.authenticateToken(token, true);

    if (userId) {
      const user = await hfunction.getUserById(userId);
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      res.status(200).send({
        message: "User is authenticated",
        data: {
          id: user["id"],
          user_id: user["user_id"],
          email: user["email"],
        },
      });
    } else {
      res.status(403).send({
        message: "User is not authenticated",
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};

const getRefreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const isAuth = hfunction.authenticateToken(refreshToken, false);
  if (isAuth) {
    const accessToken = hfunction.generateToken({ user_id: "user_id" }, true);
    res.status(200).send({
      message: "User is authenticated",
      data: {
        accessToken,
      },
    });
  } else {
    res.status(403).send({
      message: "User is not authenticated",
    });
  }
};

const uploadImage = async (req: Request, res: Response) => {
  try {
    const documentFile = (req as MulterRequest).file;
    const header = req.headers["authorization"];
    const token = header.split(" ")[1];
    console.log(`token received : ${token}`);

    const user = await hfunction.authenticateToken(token, true);
    if (!user) {
      return res.status(403).json({ error: "User not authenticated" });
    }

    if (!documentFile) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!hFunctions.allowedFiles(documentFile.originalname)) {
      return res.status(400).json({ error: "File type not allowed" });
    }

    const tempPath = documentFile.path;
    const targetPath = path.join(
      __dirname,
      "images/",
      documentFile.originalname
    );

    utils.fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({
        message: "File uploaded successfully",
        data: {
          path: targetPath,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  signup,
  loginUser,
  getRefreshToken,
  getUser,
  uploadImage,
};
