let anecdotes = [
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
]

// Anecdotes API
export const getAll = async () => [...anecdotes]

export const createAnecdote = async (newAnecdote) => {
  const anecdote = { ...newAnecdote, id: Math.round(Math.random() * 10000) }
  anecdotes.push(anecdote)
  return anecdote
}

export const voteAnecdote = async (id) => {
  const anecdote = anecdotes.find(a => a.id === id)
  if (!anecdote) throw new Error('Anecdote not found')
  anecdote.votes += 1
  return anecdote
}

export const deleteAnecdote = async (id) => {
  anecdotes = anecdotes.filter(a => a.id !== id)
  return id
}

// Users API
export const getUsers = async () => {
  const usersMap = {}
  anecdotes.forEach(a => {
    if (!usersMap[a.author]) usersMap[a.author] = []
    usersMap[a.author].push(a)
  })

  return Object.entries(usersMap).map(([name, blogs], index) => ({
    id: index + 1,
    name,
    blogs
  }))
}

export const getUserById = async (id) => {
  const users = await getUsers()
  return users.find(u => u.id === Number(id))
}
