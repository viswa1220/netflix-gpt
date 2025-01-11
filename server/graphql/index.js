const { mergeResolvers } = require("@graphql-tools/merge");
const userResolver = require("./userResolver");
const categoryResolver = require("./categoryResolver");
const productResolver = require("./productResolver");
const reviewResolver = require("./reviewResolver");
const cartResolver = require("./cartResolver");


const resolvers = mergeResolvers([userResolver, categoryResolver, productResolver,reviewResolver,cartResolver]);

module.exports = resolvers;
