const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const app = express();
const cors = require('cors');

const schema = `
type Query {
    siteMeta: SiteMeta!
}

type SiteMeta {
    availableCountries: [Country!]
    availableRegions(countryCode: String!): [Region]
}

type Country {
    countryCode: String!
    displayName: String!
}

type Region {
    regionCode: String!
    displayName: String!
}
`

const data = {
    availableCountries: [{
        countryCode: 'US',
        displayName: '\'Merica',
    },{
        countryCode: 'NL',
        displayName: 'Amsterdam',
    }],
    availableRegionsByCountryCode: {
        'US': [{ regionCode: 'MD', displayName: 'Murlin'}, { regionCode: 'PA', displayName: 'Pennsyltucky'}, { regionCode: 'CA', displayName: 'Surf\'s Up'}],
        'NL': [{ regionCode: '01', displayName: 'Not Worldly'}, { regionCode: '02', displayName: 'Sorry'}],
    }
};

const resolvers = {
    Query: {
        siteMeta: () => ({})
    },
    SiteMeta: {
        availableCountries: () => data.availableCountries,
        availableRegions: (_, { countryCode }) => data.availableRegionsByCountryCode[countryCode] || []
    }
}

app.use(cors())

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema: makeExecutableSchema({
        typeDefs: schema,
        resolvers,
      }),
    context: { user: req.user },
  })),
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
);

app.listen(process.env.PORT || 3001, () => {
    console.log('🤯  Yas Kween')
})