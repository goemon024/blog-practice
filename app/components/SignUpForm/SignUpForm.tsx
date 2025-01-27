import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";

const SignUpForm = () => {
  return (
    <div className={styles.wrapper}>
      <h2>Sign Up</h2>

      <form className={styles.formContainer}>
        <p className={styles.inputTitle}>Name</p>
        <input type="text" placeholder="Enter your name" />

        <p className={styles.inputTitle}>Email</p>
        <input type="email" placeholder="Enter your email" />

        <p className={styles.inputTitle}>Password</p>
        <input type="password" placeholder="Enter your password" />

        <div className={styles.submitButtonContainer}>
          <button type="submit" className={styles.submitButton}>
            Sign Up
          </button>
        </div>
      </form>

      <p className={styles.comment}>
        Already have an account?
        <Link href="/signin">
          <span>Sign In</span>
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
