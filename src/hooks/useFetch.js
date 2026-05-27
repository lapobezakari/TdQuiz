import { useState, useEffect } from 'react'

function useFetch(url) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Erreur lors du chargement')
        return res.json()
      })
      .then(json => { setData(json); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [url])

  return { data, loading, error }
}

export default useFetch
