declare const _default: (() => {
    type: string;
    host: string;
    port: string;
    uri: string;
    username: string;
    password: string;
    database: string;
}) & import("@nestjs/config").ConfigFactoryKeyHost;
export default _default;
