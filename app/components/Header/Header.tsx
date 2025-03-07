"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link"; // Linkコンポーネントをインポート
import EditIcon from "@mui/icons-material/Edit";
import UserIconButton from "../UserIconButton/UserIconButton";
// import { User } from "lib/types";

import { useSession, signOut } from "next-auth/react";

// ダミーデータ
// const user: User = {
//   id: "0",
//   name: "テスト太郎",
//   email: "testtarou@gmail.com",
//   image_path: "/testtarou.jpg",
//   created_at: "2021-01-01",
//   updated_at: "2021-01-01",
// };
//ダミーデータ終了

export const Header = () => {
  // 本来はSessionか何かから、User情報の取得を行う。
  // const [signedInUser, setSignedInUser] = useState<User | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Session status:", status);
    // eslint-disable-next-line no-console
    console.log("Session data:", session);
  }, [session, status]);

  // モーダルの開閉状態を管理
  const [isOpen, setIsOpen] = useState(false);

  // モーダルのDOM要素への参照を保持
  const modalRef = useRef<HTMLDivElement | null>(null);

  // モーダル外クリック時にモーダルを閉じる処理
  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // モーダルが開いている間だけ、クリックイベントを監視してモーダル外クリックを検知
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>Blog</div>
        <nav className={styles.nav}>
          <Link href="/" passHref>
            <button className={`${styles.navButton} ${styles.primary}`}>Home</button>
          </Link>

          {session && (
            <Link href="/post/create" passHref>
              <button className={`${styles.navButton} ${styles.primary}`}>
                <EditIcon sx={{ fontSize: 10, marginRight: 1 }}></EditIcon>
                Create
              </button>
            </Link>
          )}

          {!session && (
            <div className={styles.navButtonSection}>
              <Link href="/signup" passHref>
                <button className={styles.navButton}>Sign Up</button>
              </Link>
              <Link href="/signin" passHref>
                <button className={styles.navButton}>Sign In</button>
              </Link>
            </div>
          )}

          {session && (
            <div className={styles.userSection}>
              <p>{session.user?.username}</p>
              <Link href={`/profile/${session.user?.username}`}>
                <div className={styles.iconContainer}>
                  <UserIconButton
                    imagePath={session.user?.image ?? ""}
                  />
                  <div className={styles.dropdownMenu}>
                    {/* <div className={styles.modalBox} ref={modalRef}> */}
                    <p className={styles.modalUserName}>{session?.user?.name}</p>
                    <button className={styles.modalLogoutButton} onClick={() => signOut()}>
                      Logout
                    </button>
                  </div>
                  {/* </div> */}
                </div>
              </Link>

              {/* {isOpen && (
                <div className={styles.modalBox} ref={modalRef}>
                  <p className={styles.modalUserName}>{session?.user?.name}</p>
                  <button
                    // 本来はSignedOutApi呼び出しなどを行う。
                    onClick={() => signOut()}
                    className={styles.modalLogoutButton}
                  >
                    Logout
                  </button>
                </div>
              )} */}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
