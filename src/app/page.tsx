import styles from "./page.module.css";
import ClientTodoList from '@/components/ClientTodoList';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ClientTodoList />
      </main>
    </div>
  );
}
