export const Select = (props) => {
	const options = props.data.map((s, i) => {
		return (
			<option key={`${s.value}${i}`} value={s.value}>
				{s.label}
			</option>
		);
	});
	return (
		<div>
			{/* <label htmlFor={props.id}>{props.label}</label> */}
			<select>{options}</select>
		</div>
	);
};
