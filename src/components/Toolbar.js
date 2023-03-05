//Created by bash script
import styles from "./Toolbar.module.css";

export const Toolbar = (props) => {
	return <div className={styles.Toolbar}>{props.children}</div>;
};
