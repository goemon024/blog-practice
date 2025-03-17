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
      // eslint-disable-next-line no-console
      console.log("Sign in result:", result);

      router.push("/");
      router.refresh();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("エラーが発生しました", error);
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
