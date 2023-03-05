//Created by bash script
import styles from "./Indicator.module.css";

export const Indicator = ({
	Category,
	LatestValue,
	LatestValueDate,
	PreviousValue,
	PreviousValueDate,
	Source,
	Frequency,
	Title,
	Unit,
	keyIndex,
	Change,
	BestChange,
	BestLatestValue,
	BestPreviousValue,
}) => {
	const outline = BestLatestValue === true ? styles.outline : "";

	return (
		<div
			key={`${Title}${keyIndex}`}
			className={`${styles.Indicator} ${outline}`}
		>
			<div>
				{/* <h2>{Title}</h2> */}

				<IndicatorTitle
					Title={Category}
					Source={Source}
					Frequency={Frequency}
				/>
				<div className={styles.IndicatorGroup}>
					<IndicatorValue
						Tag="Latest"
						Value={LatestValue}
						Unit={Unit}
						ValueDate={LatestValueDate}
					/>

					<IndicatorValue
						Tag="Previous"
						Value={PreviousValue}
						Unit={Unit}
						ValueDate={PreviousValueDate}
					/>
					<IndicatorValue
						accent={true}
						Tag="Change"
						Value={Change}
						Unit={Unit}
					/>
				</div>
			</div>
		</div>
	);
};

const IndicatorValue = ({ Tag, ValueDate, Unit, Value }) => {
	const color = Value > 0 ? styles.positive : styles.negative;
	let date;
	let dateString = "";
	if (ValueDate) {
		date = new Date(ValueDate);
		dateString = date.toLocaleDateString();
	}
	return (
		<div className={styles.IndicatorValue}>
			<div>
				<span className={styles.Tag}>{Tag}</span>
				<span className={styles.Date}>{dateString}</span>
			</div>
			<div>
				<div className={`${styles.Value} ${color}`}>{Value.toFixed(2)}</div>
				<div className={styles.Unit}>{Unit}</div>
			</div>
		</div>
	);
};

const IndicatorTitle = ({ Title, Source, Frequency }) => {
	return (
		<div className={styles.IndicatorTitle}>
			<h2>{Title}</h2>
			<span className={styles.Source}>{`${Source} `}</span>
			<span className={styles.Frequency}>({Frequency})</span>
		</div>
	);
};
