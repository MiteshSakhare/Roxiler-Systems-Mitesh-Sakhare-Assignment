"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        name: process.env.DB_NAME || 'store_rating_db',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret',
        expiry: process.env.JWT_EXPIRY || '1d',
    },
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@nimbus.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@1234',
        name: process.env.ADMIN_NAME || 'System Administrator Default',
    },
});
//# sourceMappingURL=configuration.js.map