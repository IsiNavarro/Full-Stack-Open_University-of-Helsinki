const Notification = ({message, success}) => {

    const successStyles = {
        color: 'green',
        background: 'white',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    const errorStyles = {
        color: 'red',
        background: 'white',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (message === null) return null
    return(
        <div style={success ? successStyles : errorStyles}>{message}</div>
    )
}

export default Notification