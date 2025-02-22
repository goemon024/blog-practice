'use client';

import { useState, useEffect } from "react";
import styles from "./ProfilePage.module.css";
import { User, Post } from "lib/types";
import Pagination from "../../components/Pagination/Pagination";

type UserCustom = Omit<User, "id" | "created_at" | "updated_at">

type PostCustom = Pick<Post, "image_path" | "id" | "title" | 'created_at'> & {
    users: { username: string };
    categories: { name: string | null };
}

type ProfileContentProps = {
    initialUserData: UserCustom | null,
    initialPosts: PostCustom[]
}

export const ProfileContent = ({ initialUserData, initialPosts }: ProfileContentProps) => {
    const [displayPosts, setDisplayPosts] = useState(initialPosts.slice(0, 9));
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setDisplayPosts(initialPosts.slice((currentPage - 1) * 9, currentPage * 9));
    }, [currentPage, initialPosts]);

    return (
        <main className={styles.container}>
            {/* UI部分の実装 */}
            <Pagination
                postNumber={initialPosts.length}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </main>
    );
};