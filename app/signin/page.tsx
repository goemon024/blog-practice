"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./signIn.module.css";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("ログインに失敗しました");
        return;
      }
      console.log("Sign in result:", result);

      router.push("/");
      router.refresh();
    } catch (error) {
      setError("エラーが発生しました");
    }
  };

  return (
    <div className={styles.signinContainer}>
      <h1 className={styles.signinHeader}>sign in</h1>
      <form className={styles.signinForm} onSubmit={handleSubmit}>
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
        {error && <p className="text-red-500">{error}</p>}
        <button className={styles.signinButton} type="submit">
          ログイン
        </button>
      </form>
    </div>
  );
}

// import React, { useState } from "react";
// import Link from "next/link";
// import { Button } from "@mui/material";
// import "./sign_in.css";

// export default function SignIn() {
//   const [email, setEmail] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   // メールアドレスの入力を確認する
//   const inputEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setEmail(value);
//     // メールアドレスの形式を確認する
//     const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
//     if (value === "") {
//       setEmailError("メールアドレスを入力してください");
//     } else if (!emailRegex.test(value)) {
//       setEmailError("正しいメールアドレスを入力してください");
//     } else {
//       setEmailError("");
//     }
//   };

//   // パスワードの入力確認
//   const inputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setPassword(value);

//     // パスワードの入力形式確認
//     if (value === "") {
//       setPasswordError("パスワードを入力してください");
//     } else if (value.length < 8) {
//       setPasswordError("パスワードは8文字以上で入力してください");
//     } else {
//       setPasswordError("");
//     }
//   };

//   return (
//     <div className="signin-container">
//       <h1 className="signin-header">Sign In</h1>
//       <form className="signin-form">
//         {/* onSubmit={handleSignIn}> */}
//         {/* メールアドレスInput */}
//         <div className="form-group">
//           <p className="form-label">Email</p>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className="form-input"
//             value={email}
//             onChange={inputEmail}
//           />
//         </div>
//         {/* パスワードInput */}
//         <div className="form-group">
//           <p className="form-label">Password</p>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             className="form-input"
//             value={password}
//             onChange={inputPassword}
//           />
//         </div>
//         {/* サインインボタン */}
//         <Button type="submit" className="signin-button" disabled={!!emailError || !!passwordError}>
//           Sign In
//         </Button>
//       </form>
//       {/* 未登録の場合、サインアップへ */}
//       <div className="signup-container">
//         <span className="signup-text">Don&apos;t have an account?</span>
//         <Link href="/app/components/SignUp/SignUp.tsx" className="signup-link">
//           Sign Up
//         </Link>
//       </div>
//     </div>
//   );
// }
