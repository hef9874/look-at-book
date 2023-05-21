const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

console.log('1 -first log');
const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,

});


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

console.log('2 - second log');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });

    console.log('3 - third log');


    db.once('open', () => {
        app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
};


startApolloServer(typeDefs, resolvers);