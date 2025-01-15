import styles from "./styles.module.css";
import SignUpForm from "../components/SignUpForm/SignUpForm";

const SignUpPage = () => {
  return (
    <div className={styles.container}>
      <SignUpForm />
    </div>
  );
};

export default SignUpPage;
