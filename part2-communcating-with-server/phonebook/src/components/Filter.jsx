const Filter = ({value, onChange}) => {
    console.log(value);
    
    return( 
    <div>
        filter by name<input type="text" value={value} onChange={onChange}/>
      </div>
    )

}

export default Filter