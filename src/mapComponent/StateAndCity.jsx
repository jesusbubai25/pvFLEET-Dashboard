import React, { useState } from 'react'

// Latest version - v3.0.0 with Tree Shaking to reduce bundle size
import { Country, State, City } from 'country-state-city';
import { ICountry, IState, ICity } from 'country-state-city'


// Import Interfaces`

const StateAndCity = () => {
  const [countries, setCountries] = useState(Country.getAllCountries())
  const [country, setCountry] = useState("IN")
  const [states, setStates] = useState(State.getStatesOfCountry("IN"))

  console.log(State.getStatesOfCountry("IN"))
console.log(City.getCitiesOfState("IN","WB"))
  return (
    <>
      <h2>Select Country and State</h2>
      <div style={{ border: "2px solid red" }}>
        <select value={"IN"} style={{ width: "12vmax" }} name="country" id="country"
          onChange={(e) => setStates(State.getStatesOfCountry(e.target.value))}
        >
          {
            countries && countries?.map((e, index) => {
              return (
                <option key={index} value={e.isoCode}>
                  {e.name}
                </option>
              )
            })
          }

        </select>
        <select>
          {
            states && states.map((e, index) => {
              return (
                <option key={index} value={e.name}>
                  {e.name}
                </option>
              )
            })

          }

        </select>
      </div>
    </>


  )
}

export default StateAndCity