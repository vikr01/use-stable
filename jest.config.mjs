import { createRequire } from "module";

const require = createRequire(import.meta.url);

export default {
  testEnvironment: require.resolve("jest-environment-jsdom"),
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: require.resolve("./tsconfig.json") },
    ],
  },
  testPathIgnorePatterns: ["/dist/"],
};
