const path = require('path');

module.exports = {
  // Other webpack configurations...
  resolve: {
    fallback: {
      "util": require.resolve("util/"),
      "fs": false
    }
  }
};
