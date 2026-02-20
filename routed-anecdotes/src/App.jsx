import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate
} from 'react-router-dom'
import { useField } from './hooks'
import { useNotification } from './NotificationContext'


const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
      <Link style={padding} to="/about">about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>
            {anecdote.content}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => a.id === Number(id))

  if (!anecdote) {
    return <div>Anecdote not found</div>
  }

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>Author: {anecdote.author}</div>
      <div>Votes: {anecdote.votes}</div>
      <div>
        More info: <a href={anecdote.info}>{anecdote.info}</a>
      </div>
    </div>
  )
}

const Notification = ({ notification }) => {
  if (!notification) return null

  return (
    <div style={{
      border: '1px solid green',
      padding: 10,
      marginBottom: 10
    }}>
      {notification}
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an incident...
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can find the best and add more.
    </p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
  </div>
)

const CreateNew = ({ addNew }) => {
  const navigate = useNavigate()

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()

    addNew({
      content: content.inputProps.value,
      author: author.inputProps.value,
      info: info.inputProps.value,
      votes: 0
    })

    navigate('/')
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.inputProps} />
        </div>
        <div>
          author
          <input {...author.inputProps} />
        </div>
        <div>
          url for more info
          <input {...info.inputProps} />
        </div>

        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  )
}


const App = () => {

  const [notification, dispatch] = useNotification()

  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])



  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))

    dispatch({
      type: 'SET',
      payload: `A new anecdote "${anecdote.content}" created!`
    })

    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>

        <Menu />
        <Notification notification={notification} />
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/about" element={<About />} />
          <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  )
}

export default App

