"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = __importDefault(require("../config/Jwt/jwtConfig"));
function authenticationToken(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }
    console.log("sssssssssssssssssssssseeeeeeeeeeee", authHeader);
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }
    console.log('2222222222222222222');
    jsonwebtoken_1.default.verify(token, jwtConfig_1.default, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        console.log('33333333333333333333333333', decoded);
        req.user = decoded;
        next();
    });
}
exports.default = authenticationToken;
