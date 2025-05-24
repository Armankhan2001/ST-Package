import crypto from "crypto";

class Auth {
  /**
   * Hash a password using SHA-256 with salt
   * @param password Plain text password
   * @returns Hashed password
   */
  hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return `${salt}:${hash}`;
  }

  /**
   * Verify a password against a hashed password
   * @param password Plain text password to verify
   * @param hashedPassword Hashed password from storage
   * @returns Boolean indicating if the password is correct
   */
  verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(":");
    const calculatedHash = crypto
      .createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hash === calculatedHash;
  }

  /**
   * Generate a random token
   * @param length Length of the token
   * @returns Random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }
}

export const auth = new Auth();
