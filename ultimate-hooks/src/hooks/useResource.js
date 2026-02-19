import { useState, useEffect } from 'react'
import axios from 'axios'

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    const fetchResources = async () => {
      const response = await axios.get(baseUrl)
      setResources(response.data)
    }
    fetchResources()
  }, [baseUrl])

  const create = async (newResource) => {
    const response = await axios.post(baseUrl, newResource)
    setResources(resources.concat(response.data))
    return response.data
  }

  return [resources, { create }]
}
