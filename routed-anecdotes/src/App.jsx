import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import { useField } from './hooks'
import { useNotification } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, createAnecdote } from './services/anecdotes'

const Menu = () => (
  <div>
    <Link to="/" style={{ paddingRight: 5 }}>anecdotes</Link>
    <Link to="/create" style={{ paddingRight: 5 }}>create new</Link>
    <Link to="/about">about</Link>
  </div>
)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(a => (
        <li key={a.id}>
          <Link to={`/anecdotes/${a.id}`}>{a.content}</Link>
        </li>
      ))}
    </ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => a.id === Number(id))
  if (!anecdote) return <div>Anecdote not found</div>

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>Author: {anecdote.author}</div>
      <div>Votes: {anecdote.votes}</div>
      <div>More info: <a href={anecdote.info}>{anecdote.info}</a></div>
    </div>
  )
}

const Notification = ({ notification }) => {
  if (!notification) return null
  return <div style={{ border: '1px solid green', padding: 10, marginBottom: 10 }}>{notification}</div>
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident...</em>
    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => <div>Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.</div>

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
        <div>content <input {...content.inputProps} /></div>
        <div>author <input {...author.inputProps} /></div>
        <div>url for more info <input {...info.inputProps} /></div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const App = () => {
  const [notification, dispatch] = useNotification()
  const queryClient = useQueryClient()

  const { data: anecdotes = [], isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SET', payload: `A new anecdote "${newAnecdote.content}" created!` })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    }
  })

  const addNew = (anecdote) => newAnecdoteMutation.mutate(anecdote)

  if (isLoading) return <div>Loading anecdotes...</div>

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
