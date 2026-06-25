declare const _default: () => {
    port: number;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    jwt: {
        secret: string;
        expiry: string;
    };
    admin: {
        email: string;
        password: string;
        name: string;
    };
};
export default _default;
