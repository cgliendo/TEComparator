//Created by bash script
import styles from "./Row.module.css";

export const Row = (props) => {
	let classes = `${styles.Row}`;
	if (props.center) classes = `${classes} ${styles.center}`;
	if (props.spacebetween) classes = `${classes} ${styles.spacebetween}`;
	if (props.spacearound) classes = `${classes} ${styles.spacearound}`;
	return <div className={classes}>{props.children}</div>;
};
