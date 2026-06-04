const Notification = ({message}) => {

    const styles = {
        color: 'green',
        background: 'white',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (message === null) return null
    return(
        <div style={styles}>{message}</div>
    )
}

export default Notification