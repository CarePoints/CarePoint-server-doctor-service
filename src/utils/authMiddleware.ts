
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import secretKey from '../config/Jwt/jwtConfig';


export interface UserPayload extends JwtPayload {
  id: string; 
  username: string;
}

function authenticationToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }
console.log("sssssssssssssssssssssseeeeeeeeeeee",authHeader);

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
  }
console.log('2222222222222222222');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
    console.log('33333333333333333333333333',decoded);
    req.user = decoded as UserPayload;
    
    next();
  });
}

export default authenticationToken;
