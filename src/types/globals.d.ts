declare global {
    namespace NodeJS {
        interface ProcessEnv {
        JWT_SECRET: string,
        BASE_URL: string
        }
    }
}
export {};