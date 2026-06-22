import Part from "./Part"

const Content = (props) => {
    let contentArray = []
    props.parts.forEach(part => {
        contentArray.push(<Part key={props.parts.indexOf(part)} part={part}/>)
    })
    return <div>
        {contentArray}
    </div>
}
export default Content