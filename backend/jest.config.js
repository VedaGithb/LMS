export default {
    setupFiles: ["<rootDir>/src/tests/setup.ts"],
    setupFilesAfterEnv: ["<rootDir>/src/tests/setupAfterEnv.ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    }
};