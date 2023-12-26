const productRoute = require("express").Router();
const Data = require("../DataFile/Data");
const productCollection = require("../model/productModel");

productRoute.get("/", async (req, res) => {
    const Result = await productCollection.find();
    return res.send(Result);
});

productRoute.get("/product/:id", async (req, res) => {
    const productID = req.params.id;
    const MatchedData = await productCollection.find({ id: { $eq: Number(productID) } });
    return res.send(MatchedData)
});

productRoute.get("/search/:searchedBy", async (req, res) => {
    const search= req.params.searchedBy;
    const filteredata = Data.filter((product) => product.title.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase() === search.toLowerCase() || product.category.toLowerCase().includes(search.toLowerCase()) || product.brand.toLowerCase() === search.toLowerCase());
    return res.send(filteredata);
});
module.exports = productRoute;