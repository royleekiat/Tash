var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var path = require('path');


var schema = buildSchema(`
    type Query {
        datapoint(id: Int!): Datapoint
        datapoints(portfolio: String): [Datapoint]
    },
    type Datapoint {
        id: Int
        period: String
        value: Int
        portfolio: String
    }
`);


var datapointsList = [
    {
        id: 1,
        period: '2017-07-01',
        value: 135555,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 2,
        period: '2017-08-01',
        value: 145235,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 3,
        period: '2017-09-01',
        value: 135055,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 4,
        period: '2017-10-01',
        value: 125235,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 5,
        period: '2017-07-01',
        value: 155235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 6,
        period: '2017-08-01',
        value: 165235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 7,
        period: '2017-09-01',
        value: 145235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 8,
        period: '2017-10-01',
        value: 155231,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    }
]
var getDatapoint = function(args) { 
    var id = args.id;
    return datapointsList.filter(datapoint => {
        return datapoint.id == id;
    })[0];
}
var getDatapoints = function(args) {
    if (args.portfolio) {
        var portfolio = args.portfolio;
        return datapointsList.filter(datapoint => datapoint.portfolio === portfolio);
    } else {
        return datapointsList;
    }
}
var root = {
    datapoint: getDatapoint,
    datapoints: getDatapoints
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true //process.env.NODE_ENV === 'development' //true
}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/view.html'));
});

app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));