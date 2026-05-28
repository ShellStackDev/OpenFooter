export declare const readCache: (key: string, ttlSeconds: number) => {
    data: unknown;
    fresh: boolean;
} | null;
export declare const writeCache: (key: string, data: unknown) => void;
