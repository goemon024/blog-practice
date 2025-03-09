"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/util/supabase";
import styles from "./signUp.module.css";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // まずSupabase Authでユーザーを作成
      // await supabase.auth.admin.createUser

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError1(authError.message);
        return;
      }

      if (authData.user?.id) {
        // 次にusersテーブルにユーザー情報を保存
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: authData.user.id,
            email: email,
            username: username,
          },
        ]);

        if (profileError) {
          setError2(profileError.message);
          return;
        }

        router.push("/signin");
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("エラーが発生しました", error);
      // setError("エラーが発生しました");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.signupHeader}>sign up</h1>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <p className={styles.formLabel}>メールアドレス</p>
          <input
            className={styles.formInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <p className={styles.formLabel}>ユーザー名</p>
          <input
            className={styles.formInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <p className={styles.formLabel}>パスワード</p>
          <input
            className={styles.formInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            required
          />
        </div>
        {error1 && <p className="text-red-500">1.{error1}</p>}
        {error2 && <p className="text-red-500">2.{error2}</p>}
        <button className={styles.signupButton} type="submit">
          アカウント作成
        </button>
      </form>
    </div>
  );
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
