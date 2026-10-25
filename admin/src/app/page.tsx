import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import styles from './status.module.css';

/** 관리 서버 API가 생기기 전의 시작 화면. 기능별 준비 상태만 보여 줍니다. */
const ITEMS = [
  { name: '로그인', status: '준비 중' },
  { name: '내용 고치기 (Album, Seminars 등)', status: '준비 중' },
  { name: '공개 반영', status: '준비 중' },
];

export default function AdminHome() {
  return (
    <>
      <PageHeader title="관리 화면" lede="사이트에 보이는 내용을 편집하고 공개 사이트에 반영하는 화면입니다." />
      <Section title="준비 상태">
        <ul className={styles.list}>
          {ITEMS.map((i) => (
            <li key={i.name} className={styles.row}>
              <span className={styles.name}>{i.name}</span>
              <span className={styles.status}>{i.status}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
