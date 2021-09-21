const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const webpack = require('webpack');

let config = {
    mode: "production",
    entry: {
        index: "./static/js/index.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins: [],
    context: __dirname,
    target: "web"
};

module.exports = (env, argv) => {
    if(process.env.NODE_ENV == 'development'){
        config.mode = 'development';
        config.devtool = 'source-map';
    }
    let basePath = path.resolve(__dirname, '.env');
    let envPath = basePath + '.' + process.env.NODE_ENV;
    if(!fs.existsSync(envPath) && process.env.NODE_ENV != 'production'){
        console.log(`INFO: Environment file for ${process.env.NODE_ENV} environment not found`);
        console.log('INFO: Falling back to production environment file');
    }
    if(fs.existsSync(envPath)){
        let fileEnv = dotenv.config({path: envPath}).parsed;
        let envKeys = Object.keys(fileEnv).reduce((prev, next) => {
            prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
            return prev;
        }, {});
        config.plugins.push(new webpack.DefinePlugin(envKeys));
    }
    else {
        console.error('WARNING: Environment file does not exist');
    }
    return config;
};