//Created by bash script
import { useState } from "react";
import styles from "./Exhibit.module.css";
import { ExhibitItem } from "./ExhibitItem";

export const Exhibit = (props) => {
	return <div className={styles.Exhibit}>{props.children}</div>;
};
