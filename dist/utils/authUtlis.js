"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtConfig_1 = __importDefault(require("../config/Jwt/jwtConfig"));
function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        roles: user.roles
    };
    const options = { expiresIn: '1h' };
    return jsonwebtoken_1.default.sign(payload, jwtConfig_1.default, options);
}
function generateRefreshToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        roles: user.roles
    };
    const options = { expiresIn: '24h' };
    return jsonwebtoken_1.default.sign(payload, jwtConfig_1.default, options);
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, jwtConfig_1.default);
    }
    catch (error) {
        throw new Error('Invalid token');
    }
}
