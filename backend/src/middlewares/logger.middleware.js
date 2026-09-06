

async function logger (req, res, next) {
    console.log("Method:", req.method);
    console.log("URL:", req.url);
    console.log("Base URL:", req.baseUrl);
    console.log("Time:", new Date().toLocaleString());

    next();
}

module.exports = { logger} ;