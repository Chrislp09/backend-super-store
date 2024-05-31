const config = {
    env: "dev",
    dev: {
        apiRoot: process.env.MONGODB_URI_SUPERSTORE
    },
    test: {
        apiRoot: process.env.MONGODB_URI_TEST
    },
    local: {
        apiRoot: process.env.MONGO_URI_LOCAL
    },
};

module.exports = config;