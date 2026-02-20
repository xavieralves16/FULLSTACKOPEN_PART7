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

export const getAll = async () => {
  return [...anecdotes]
}

export const createAnecdote = async (newAnecdote) => {
  const anecdote = { ...newAnecdote, id: Math.round(Math.random() * 10000) }
  anecdotes.push(anecdote)
  return anecdote
}
