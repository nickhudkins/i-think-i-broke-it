# Simplified Test Case (fetchMore)

Howdy traveler, this repository contains a frontend application (`app`) as well as a graphql server (`server`). In order to run it, please `cd` into each directory, run `yarn` to get your dependencies setup, then in each directory you can run `yarn start`. The graphql server will run on port `3001` and the app on `3000`

## Expected Behavior
Upon selecting a country, the region selector should appear, as `fetchMore` defines `updateQuery` which merges the newly fetched data.

### What happens
Despite defining `updateQuery`, and returning the merged information, the function as child of the `Query` component is not re-rendered, and therefore the newly fetched data never flows back down. Also, I cry.


### Why are you doing it like this?
To prevent over-fetching. If I were to instead do some sort of refetch query, and change variables, I would end up re-fetching all of the country data. While not a lot, I come from Relay, so I have a lower tolerance for over fetching :). As we look to expand our application to emerging markets, these sort of considerations, and being respectful of our data usage is muy importante.