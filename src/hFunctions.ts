import tool from "./utils";
import query from "./queries";

const accessSecret = process.env.ACCESS_SECRET;

const refreshSecret = process.env.REFRESH_SECRET;

const saltRounds = 10;

function generateToken(user: any, isAccess: boolean): string {
  const duration: string = isAccess ? "60m" : "7d";
  const secret: string = isAccess ? accessSecret : refreshSecret;
  return tool.jwt.sign(user, secret, { expiresIn: duration });
}

function authenticateToken(token: string, isAccess: boolean): any {
  if (!token) {
    return false;
  }
  const secret = isAccess ? accessSecret : refreshSecret;
  try {
    const user = tool.jwt.verify(token, secret);
    return user["user_id"];
  } catch (err) {
    return err;
  }
}

function allowedFiles(filename: string): boolean {
  const ext = tool.path.extname(filename).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".gif"].includes(ext);
}

async function hashedPassword(password: string): Promise<string> {
  const result = await tool.bcrypt.hash(password, saltRounds);
  return result;
}

async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  const result = await tool.bcrypt.compare(password, hash);
  return result;
}

// Database Functions
async function createUser(
  user_id: string,
  password: string,
  email: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    tool.db.run(query.insertIntoTable, [user_id, password, email], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function getUserById(user_id: string): Promise<any> {
  return new Promise((resolve, reject) => {
    tool.db.get(query.findUserById, [user_id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export default {
  generateToken,
  authenticateToken,
  allowedFiles,
  hashedPassword,
  comparePassword,
  getUserById,
  createUser,
};
