import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom'
import { useField } from './hooks'
import { useNotification } from './NotificationContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAll, createAnecdote, voteAnecdote, deleteAnecdote , addComment} from './services/anecdotes'
import { useReducer } from 'react'
import UsersView from './UsersView'
import UserDetailView from './UserDetailView'
import React from 'react'
import './App.css'


// Reducer para o estado do user
const userReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

const Menu = ({ user, logout }) => (
  <div style={{ paddingBottom: 10, borderBottom: '1px solid black', marginBottom: 20 }}>
    <Link to="/" style={{ paddingRight: 10 }}>Anecdotes</Link>
    <Link to="/create" style={{ paddingRight: 10 }}>Create New</Link>
    <Link to="/about" style={{ paddingRight: 10 }}>About</Link>
    <Link to="/users" style={{ paddingRight: 10 }}>Users</Link>

    <span style={{ float: 'right' }}>
      {user ? (
        <>
          Logged in as <strong>{user.username}</strong> <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </span>
  </div>
)


const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '5px' }}>Content</th>
          <th style={{ border: '1px solid black', padding: '5px' }}>Author</th>
          <th style={{ border: '1px solid black', padding: '5px' }}>Votes</th>
        </tr>
      </thead>
      <tbody>
        {anecdotes.map(a => (
          <tr key={a.id}>
            <td style={{ border: '1px solid black', padding: '5px' }}>
              <Link to={`/anecdotes/${a.id}`}>{a.content}</Link>
            </td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{a.author}</td>
            <td style={{ border: '1px solid black', padding: '5px' }}>{a.votes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)



const Anecdote = ({ anecdotes, voteMutation, deleteMutation, dispatch, user, queryClient }) => {
  const { id } = useParams()
  const anecdote = anecdotes.find(a => a.id === Number(id))
  const commentField = useField('text')

  if (!anecdote) return <div>Anecdote not found</div>

  const commentMutation = useMutation({
    mutationFn: (comment) => addComment(anecdote.id, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  })

  const handleVote = () => {
    voteMutation.mutate(anecdote.id)
    dispatch({ type: 'SET', payload: `You liked "${anecdote.content}"` })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const handleDelete = () => {
    if (user?.username !== anecdote.user) return
    deleteMutation.mutate(anecdote.id)
    dispatch({ type: 'SET', payload: `"${anecdote.content}" deleted` })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentField.inputProps.value) return
    commentMutation.mutate(commentField.inputProps.value)
    commentField.reset()
  }

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>Author: {anecdote.author}</div>
      <div>Votes: {anecdote.votes}</div>
      <div>More info: <a href={anecdote.info}>{anecdote.info}</a></div>
      <button onClick={handleVote}>like</button>
      {user?.username === anecdote.user && <button onClick={handleDelete}>delete</button>}

      <h3>Comments</h3>
      <form onSubmit={handleAddComment}>
        <input {...commentField.inputProps} placeholder="Add a comment" />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {anecdote.comments.length === 0 && <li>No comments yet</li>}
        {anecdote.comments.map((c, idx) => (
          <li key={idx}>{c}</li>
        ))}
      </ul>
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

const CreateNew = ({ addNew, user }) => {
  const navigate = useNavigate()
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) return alert('You must be logged in to create an anecdote')

    addNew({
      content: content.inputProps.value,
      author: author.inputProps.value,
      info: info.inputProps.value,
      votes: 0,
      user: user.username // associa o user à criação
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

const Login = ({ login }) => {
  const navigate = useNavigate()
  const usernameField = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ username: usernameField.inputProps.value })
    navigate('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>username <input {...usernameField.inputProps} /></div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

const App = () => {
  const [notification, dispatch] = useNotification()
  const [user, userDispatch] = useReducer(userReducer, null)
  const queryClient = useQueryClient()

  const { data: anecdotes = [], isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  })

  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAnecdote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
  })

  const addNew = (anecdote) => newAnecdoteMutation.mutate(anecdote)
  const login = (user) => userDispatch({ type: 'LOGIN', payload: user })
  const logout = () => userDispatch({ type: 'LOGOUT' })

  if (isLoading) return <div>Loading anecdotes...</div>

  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu user={user} logout={logout} />
        <Notification notification={notification} />
        <Routes>
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew addNew={addNew} user={user} />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/anecdotes/:id"
            element={
              <Anecdote
                anecdotes={anecdotes}
                voteMutation={voteMutation}
                deleteMutation={deleteMutation}
                dispatch={dispatch}
                user={user}
              />
            }
          />
          <Route path="/login" element={<Login login={login} />} />
          <Route path="/users" element={<UsersView anecdotes={anecdotes} />} />
          <Route path="/users/:username" element={<UserDetailView anecdotes={anecdotes} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
