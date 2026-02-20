import React from 'react'

const UsersView = ({ anecdotes }) => {
  const users = anecdotes.reduce((acc, anecdote) => {
    const username = anecdote.user || 'unknown'
    if (!acc[username]) acc[username] = []
    acc[username].push(anecdote)
    return acc
  }, {})

  const usernames = Object.keys(users)

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {usernames.map(username => (
            <tr key={username}>
              <td>{username}</td>
              <td>
                <ul>
                  {users[username].map(blog => (
                    <li key={blog.id}>{blog.content}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersView
