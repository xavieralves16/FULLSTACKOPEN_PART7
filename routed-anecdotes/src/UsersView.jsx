import { Link, useParams } from 'react-router-dom'

const UsersView = ({ anecdotes }) => {
  const users = anecdotes.reduce((acc, a) => {
    if (!a.user) return acc
    if (!acc[a.user]) acc[a.user] = 0
    acc[a.user] += 1
    return acc
  }, {})

  return (
    <div>
      <h2>Users</h2>
      <table border="1">
        <thead>
          <tr>
            <th>User</th>
            <th>Created anecdotes</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(users).map(([username, count]) => (
            <tr key={username}>
              <td>
                <Link to={`/users/${username}`}>{username}</Link>
              </td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersView

