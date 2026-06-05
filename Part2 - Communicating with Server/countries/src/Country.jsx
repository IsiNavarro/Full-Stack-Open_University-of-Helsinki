const Country = ({selectedCountry}) => {
    const flagStyles = {
        fontSize: 240
    }
    const languagesArray = Object.values(selectedCountry.languages)

    return <div>
        <h1>{selectedCountry.name.common}</h1>
        <p>Capital {selectedCountry.capital}</p>
        <p>Area {selectedCountry.area}</p>

        <h2>Languages</h2>
        {languagesArray.map(language => <li key={language}>{language}</li>)}
        <div style={flagStyles}>{selectedCountry.flag}</div>

    </div>
}

export default Country