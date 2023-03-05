//Created by bash script
import styles from "./ExhibitItem.module.css";

export const ExhibitItem = (props) => {
	return (
		<div {...props} className={styles.ExhibitItem}>
			{props.children}
		</div>
	);
};
