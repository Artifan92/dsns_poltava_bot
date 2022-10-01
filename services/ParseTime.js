class ParseTime {
	constructor(time) {
		this.time = time;
	}

	parseTime() {
		const timeParse = new Date(Date.parse(this.time))
			.toLocaleTimeString('uk-UA', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
			})
			.substring(0, 5);

		return timeParse;
	}

	render() {
		return this.parseTime();
	}
}

export default ParseTime;
