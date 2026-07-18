import { db } from '../../db/client.js';
import { users } from '../../db/schema/users.js';
import { eq } from 'drizzle-orm';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ERROR_CODES } from '@satmss/shared-constants';
import { CustomError } from '../../middleware/errorHandler.js';

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'default_secret';
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] ?? '8h';
const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] ?? 'default_refresh_secret';
const JWT_REFRESH_EXPIRES_IN = process.env['JWT_REFRESH_EXPIRES_IN'] ?? '30d';

export class AuthService {
  static async login(email: string, password: string) {
    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!userRecord || !userRecord.isActive) {
      const err: CustomError = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.code = ERROR_CODES.INVALID_CREDENTIALS;
      throw err;
    }

    const isValidPassword = await argon2.verify(userRecord.passwordHash, password);
    if (!isValidPassword) {
      const err: CustomError = new Error('Invalid email or password.');
      err.statusCode = 401;
      err.code = ERROR_CODES.INVALID_CREDENTIALS;
      throw err;
    }

    // Update last login timestamp
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userRecord.id));

    // Generate JWT tokens
    const token = jwt.sign(
      { sub: userRecord.id, email: userRecord.email, role: userRecord.role },
      JWT_SECRET as jwt.Secret,
      { expiresIn: JWT_EXPIRES_IN as any },
    );

    const refreshToken = jwt.sign(
      { sub: userRecord.id },
      JWT_REFRESH_SECRET as jwt.Secret,
      { expiresIn: JWT_REFRESH_EXPIRES_IN as any },
    );

    // Omit password hash from response
    const { passwordHash: _, totpSecret: __, ...userProfile } = userRecord;

    return {
      token,
      refreshToken,
      user: userProfile,
    };
  }

  static async getMe(userId: string) {
    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!userRecord || !userRecord.isActive) {
      const err: CustomError = new Error('User not found or deactivated.');
      err.statusCode = 404;
      err.code = ERROR_CODES.NOT_FOUND;
      throw err;
    }

    const { passwordHash: _, totpSecret: __, ...userProfile } = userRecord;
    return userProfile;
  }

  static async updateMe(userId: string, notificationThreshold: number) {
    const [updatedUser] = await db
      .update(users)
      .set({ notificationThreshold, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      const err: CustomError = new Error('User not found.');
      err.statusCode = 404;
      err.code = ERROR_CODES.NOT_FOUND;
      throw err;
    }

    const { passwordHash: _, totpSecret: __, ...userProfile } = updatedUser;
    return userProfile;
  }
}
