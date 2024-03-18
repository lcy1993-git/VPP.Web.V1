import styles from './index.less';

interface PropsType {
  color: string;
  script: string;
}

const ColorCircleScript = (props: PropsType) => {
  const { color, script } = props;
  return (
    <span className={styles.colorCircleScript} style={{ color: color }}>
      <span className={styles.circle} style={{ backgroundColor: color }}></span>
      <span className={styles.script}>{script}</span>
    </span>
  );
};
export default ColorCircleScript;
