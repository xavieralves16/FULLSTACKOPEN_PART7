import React, { useState } from 'react'
import { useField, useCountry } from './hooks/index' 

const App = () => {
  const nameInput = useField('text')
  const [search, setSearch] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setSearch(nameInput.value)
  }

  const { country, found } = useCountry(search)

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input {...nameInput} />
        <button>Find</button>
      </form>

      {search && !found && <div>Country not found...</div>}

      {found && country && (
        <div>
          <h2>{country.name.common}</h2>
          <div>Capital: {country.capital}</div>
          <div>Population: {country.population}</div>
          <img src={country.flags.png} alt="flag" width="100" />
        </div>
      )}
    </div>
  )
}

export default App
