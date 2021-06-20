class ApplicationInitializeInfo {
    static PORT = process.env.APPLICATION_MODE === 'prod' ? process.env.PROD_PORT : process.env.DEV_PORT || 8080;
    static DB_URI = process.env.APPLICATION_MODE === 'prod' ? process.env.PROD_DB_URI : process.env.DEV_DB_URI;
    static JWT_SECRET = process.env.JWT_SECRET;
}

module.exports = ApplicationInitializeInfo;