import { useCallback, useState } from 'react'
import { aaa, userLogin } from './interface'

interface User {
  username: string
  email?: string
}

function App() {
  const [user, setUser] = useState<User>()

  const login = useCallback(async () => {
    const res = await userLogin('guang', '111111')

    const { userInfo, accessToken, refreshToken } = res.data

    setUser(userInfo)

    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
  }, [])

  const xxx = useCallback(async () => {
    const res = await aaa()

    console.log(res)
  }, [])

  return (
    <div className="App">
      {user?.username ? (
        `当前登录用户： ${user?.username}`
      ) : (
        <button onClick={login}>登录</button>
      )}
      <div>
        <button onClick={xxx}>aaa</button>
      </div>
    </div>
  )
}

export default App
