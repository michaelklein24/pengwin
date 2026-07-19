import type { Config } from "jest";

const config: Config = {
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": [
            "@swc/jest",
            {}
        ]
    }
};

export default config;