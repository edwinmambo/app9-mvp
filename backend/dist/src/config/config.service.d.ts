export declare class ConfigService {
    private readonly envConfig;
    constructor();
    get(key: string): string;
    get databaseUrl(): string;
    get jwtSecret(): string;
    get jwtExpiresIn(): string;
    get aiEngineUrl(): string;
    get frontendUrl(): string;
}
