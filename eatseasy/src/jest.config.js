module.exports = {
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    transformIgnorePatterns: [
      "node_modules/(?!(axios)/)", // Ensure axios and other ESM modules are transformed
    ],
    moduleNameMapper: {
      "\\.(css|less|sass|scss)$": "identity-obj-proxy", // Mock CSS imports if needed
    },
    testEnvironment: "jsdom",
  };
  