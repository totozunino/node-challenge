module.exports = {
  root: true,
  extends: ["@node-challenge/eslint-config"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
