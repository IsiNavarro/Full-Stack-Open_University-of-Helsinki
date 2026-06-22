import { useState } from "react"

const StatisticLine = ({text, value}) => {
  return <p>{text} {value}</p>
}

const Statistics = ({good, neutral, bad}) => {
  const totalClicks = good + neutral + bad
  const average = (1*good + 0*neutral + -1*bad) / totalClicks
  const positive = good / totalClicks * 100

  if (totalClicks <= 0) {
    return <><h2>statistics</h2>
    <p>No feedback given</p></>
  } else {
    return <>
    <h2>statistics</h2>
    <StatisticLine text="good" value={good}/>
    <StatisticLine text="neutral" value={neutral}/>
    <StatisticLine text="bad" value={bad}/>
    <StatisticLine text="all" value={totalClicks}/>
    <StatisticLine text="average" value={average}/>
    <StatisticLine text="positive %" value={positive}/>
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