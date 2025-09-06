import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../model/user.model';

export class AuthMiddleware {
  public static async authenticate(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).send('Authorization header missing');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send('Token missing');
    }
    try {
      const secretKey = process.env.JWT_SECRET;
      if (!secretKey) {
        throw new Error('JWT_SECRET not defined');
      }
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).send('User not found');
      }
      req.user=user;
      next();
    } catch (err) {
      return res.status(403).send('Invalid token');
    }
  }
}
export default AuthMiddleware;
