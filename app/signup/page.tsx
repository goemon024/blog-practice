
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/util/supabase'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // まずSupabase Authでユーザーを作成
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user?.id) {
        // 次にusersテーブルにユーザー情報を保存
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: email,
              username: username,
            }
          ])

        if (profileError) {
          setError(profileError.message)
          return
        }

        router.push('/signin')
      }
    } catch (error) {
      setError('エラーが発生しました')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ユーザー名"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">アカウント作成</button>
    </form>
  )
}

// import styles from "./styles.module.css";
// import SignUpForm from "../components/SignUpForm/SignUpForm";

// const SignUpPage = () => {
//   return (
//     <div className={styles.container}>
//       <SignUpForm />
//     </div>
//   );
// };

// export default SignUpPage;
