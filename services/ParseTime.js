class ParseTime {
	constructor(time) {
		this.time = time;
	}

	parseTime(time) {
		let hours, minutes;
		const timeParse = Date.parse(time);

		(hours = Math.floor((timeParse / (1000 * 60 * 60)) % 24)),
			(minutes = Math.floor((timeParse / (1000 * 60)) % 60));

		return `${hours}:${minutes}`;
	}

	render() {
		return this.parsetime(this.time);
	}
}

const newTime = new ParseTime('2022-09-30T10:53:22Z');

console.log(newTime);

export default ParseTime;
