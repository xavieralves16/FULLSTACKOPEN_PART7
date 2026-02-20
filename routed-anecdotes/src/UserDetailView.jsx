import { useParams, Link } from 'react-router-dom'

const UserDetailView = ({ anecdotes }) => {
  const { username } = useParams()

  const userAnecdotes = anecdotes.filter(a => a.user === username)

  if (!username || !userAnecdotes) return <div>Loading user...</div>

  return (
    <div>
      <h2>{username}</h2>
      <h3>Anecdotes created:</h3>
      <ul>
        {userAnecdotes.map(a => (
          <li key={a.id}>
            <Link to={`/anecdotes/${a.id}`}>{a.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserDetailView
