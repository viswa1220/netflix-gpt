const express = require("express");
const dotenv = require("dotenv");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const Order = require("./models/Order");

dotenv.config();

const app = express();
// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', // Local frontend
    'http://localhost:3001', // Local backend testing
    'https://scrollndshop.vercel.app', 
   
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers the client is allowed to send
  credentials: true // Allow cookies if required
}));
// Load GraphQL schema and resolvers
const typeDefs = fs.readFileSync(path.resolve(__dirname, "./graphql/schema.graphql"), "utf-8");
const resolvers = require("./graphql");

const startServer = async () => {
  try {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await Order.updateMany(
      { status: { $exists: false } },
      { $set: { status: "Pending" } }
    );
    console.log("Connected to MongoDB");

    // Start Apollo Server
    await server.start();
    server.applyMiddleware({ app });

    // Start Express server
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error("Server startup error:", error.message);
  }
};

startServer();
