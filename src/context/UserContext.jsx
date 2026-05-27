import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [pseudo, setPseudo]           = useState(null)
  const [bestScore, setBestScore]     = useState(0)
  const [lastAnswers, setLastAnswers] = useState([])

  return (
    <UserContext.Provider value={{ pseudo, setPseudo, bestScore, setBestScore, lastAnswers, setLastAnswers }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
