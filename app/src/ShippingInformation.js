import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const INITIAL_QUERY = gql`
  query getSomeCountriesPlease {
    siteMeta {
      availableCountries {
        countryCode
        displayName
      }
    }
  }
`;

const FETCH_MORE_QUERY = gql`
  query getRegionsForCountry($countryCode: String!) {
    siteMeta {
      availableRegions(countryCode: $countryCode) {
        regionCode
        displayName
      }
    }
  }
`;


const createOnChange = fetchMore => ({ target: { value } }) => {
    fetchMore({
      query: FETCH_MORE_QUERY,
      variables: { countryCode: value },
      updateQuery: (prev, { fetchMoreResult }) => ({
        ...prev,
        siteMeta: {
          ...prev.siteMeta,
          availableRegions: fetchMoreResult.siteMeta.availableRegions
        }
      })
    });
  };

const RegionSelector = ({ regions }) => (
  <div>
    <label>Region</label>
    {!regions && <span className="note">Please select a country first...</span>}
    {regions && (
      <select>
        {regions.map(({ regionCode, displayName }) => (
          <option key={regionCode} value={regionCode}>
            {displayName}
          </option>
        ))}
      </select>
    )}
  </div>
);

const CountryAndRegionSelector = ({
  availableCountries,
  availableRegions,
  onChange
}) => (
    <form>
      <label>Country</label>
      <select defaultValue={"EMPTY"} onChange={onChange}>
        <option disabled value="EMPTY">
          ---
        </option>
        {availableCountries.map(({ countryCode, displayName }) => (
          <option key={countryCode} value={countryCode}>
            {displayName}
          </option>
        ))}
      </select>
      <RegionSelector regions={availableRegions} />
    </form>
  );

export default class ShippingInformation extends Component {
  render() {
    return (
      <Query query={INITIAL_QUERY}>
        {({ loading, data, fetchMore }) => {
          if (loading || !data) {
            return <div>Loading...</div>;
          }
          /*
           Yeah yeah yeah, I am creating a function over and over in render.
          */
          const onChange = createOnChange(fetchMore); 
          return (
            <CountryAndRegionSelector
              onChange={onChange}
              availableRegions={data.siteMeta.availableRegions}
              availableCountries={data.siteMeta.availableCountries}
            />
          );
        }}
      </Query>
    );
  }
}
