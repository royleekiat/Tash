var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var path = require('path');


var schema = buildSchema(`
    type Query {
        datapoint(id: Int!): Datapoint
        datapoints(portfolio: String, benchmark: String): [Datapoint]
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
        period: '2017-11-01',
        value: 135555,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 6,
        period: '2017-12-01',
        value: 145235,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 7,
        period: '2018-01-01',
        value: 135055,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 8,
        period: '2018-02-01',
        value: 125235,
        portfolio: 'Stashaway Risk Index 14%',
    },
        {
        id: 9,
        period: '2018-03-01',
        value: 135555,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 10,
        period: '2018-04-01',
        value: 145235,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 11,
        period: '2018-05-01',
        value: 135055,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 12,
        period: '2018-06-01',
        value: 129235,
        portfolio: 'Stashaway Risk Index 14%',
    },
    {
        id: 13,
        period: '2017-07-01',
        value: 155235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 14,
        period: '2017-08-01',
        value: 165235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 15,
        period: '2017-09-01',
        value: 145235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 16,
        period: '2017-10-01',
        value: 155231,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 17,
        period: '2017-11-01',
        value: 155235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 18,
        period: '2017-12-01',
        value: 165235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 19,
        period: '2018-01-01',
        value: 145235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 20,
        period: '2018-02-01',
        value: 155231,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {

        id: 21,
        period: '2018-03-01',
        value: 155235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 22,
        period: '2018-04-01',
        value: 165235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 23,
        period: '2018-05-01',
        value: 145235,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 24,
        period: '2018-06-01',
        value: 155231,
        portfolio: '40% VTSMX (Stock) + 60% VBMFX (Bond)',
    },
    {
        id: 25,
        period: '2017-07-01',
        value: 115235,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 26,
        period: '2017-08-01',
        value: 135235,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 27,
        period: '2017-09-01',
        value: 125235,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 28,
        period: '2017-10-01',
        value: 115231,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 29,
        period: '2017-11-01',
        value: 135235,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 30,
        period: '2017-12-01',
        value: 145235,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 31,
        period: '2018-01-01',
        value: 141235,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 32,
        period: '2018-02-01',
        value: 135231,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {

        id: 33,
        period: '2018-03-01',
        value: 125235,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 34,
        period: '2018-04-01',
        value: 115235,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 35,
        period: '2018-05-01',
        value: 105235,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 36,
        period: '2018-06-01',
        value: 105231,
        portfolio: '20% VTSMX (Stock) + 80% VBMFX (Bond)',
    },
    {
        id: 37,
        period: '2017-07-01',
        value: 145235,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 38,
        period: '2017-08-01',
        value: 142235,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 39,
        period: '2017-09-01',
        value: 135235,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 40,
        period: '2017-10-01',
        value: 145231,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 41,
        period: '2017-11-01',
        value: 155235,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 42,
        period: '2017-12-01',
        value: 163235,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 43,
        period: '2018-01-01',
        value: 161235,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 44,
        period: '2018-02-01',
        value: 165231,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {

        id: 45,
        period: '2018-03-01',
        value: 175235,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 46,
        period: '2018-04-01',
        value: 160235,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 47,
        period: '2018-05-01',
        value: 150235,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
    },
    {
        id: 48,
        period: '2018-06-01',
        value: 155231,
        portfolio: '60% VTSMX (Stock) + 40% VBMFX (Bond)',
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
        var benchmark = args.benchmark;
        return datapointsList.filter(datapoint => datapoint.portfolio === portfolio || datapoint.portfolio === benchmark);
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

app.listen(process.env.PORT || 4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));