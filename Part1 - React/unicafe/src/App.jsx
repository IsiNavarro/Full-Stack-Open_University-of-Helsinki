import { useState } from "react"

const Statistics = ({good, neutral, bad}) => {
  const totalClicks = good + neutral + bad
  const average = (1*good + 0*neutral + -1*bad) / totalClicks
  const positive = good / totalClicks * 100

  if (totalClicks <= 0) {
    return <p>No feedback given</p>
  } else {
    return <>
    <h2>statistics</h2>
    <p>good {good}</p>
    <p>neutral {neutral}</p>
    <p>bad {bad}</p>
    <p>all {totalClicks}</p>
    <p>average {average}</p>
    <p>positive {positive} %</p>
    </>
  }
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)  

  return <>
  <h1>give feedback</h1>
  <button onClick={() => setGood(good + 1)}>good</button>
  <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
  <button onClick={() => setBad(bad + 1) }>bad</button>
  <Statistics good={good} neutral={neutral} bad={bad}/>
  </>
}

export default App