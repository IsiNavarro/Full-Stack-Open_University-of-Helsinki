const PersonForm = ({nameValue, nameOnChange, numberValue, numberOnChange, buttonOnClick}) => {
    return (
        <form>
        <div>
          name: <input value={nameValue} onChange={nameOnChange}/>
        </div>
        <div>
          number: <input value={numberValue} onChange={numberOnChange}/>
        </div>
        <div>
          <button type="submit" onClick={buttonOnClick}>
            add
          </button>
        </div>
      </form>
    )
}

export default PersonForm