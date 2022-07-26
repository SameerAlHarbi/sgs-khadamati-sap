const chalk = require("chalk");
const app = require("./app");

const port = process.env.PORT || 6000;
app.listen(port, () => {
	switch (process.env.SERVER_TYPE) {
		case "DEVELOPMENT":
			console.log(
				chalk.yellowBright.inverse(
					`SGS KHADAMATI SAP ${process.env.SERVER_TYPE} SERVER IS UP AND RUNNING ON PORT ${port}`
				)
			);
			break;
		case "QUALITY":
			console.log(
				chalk.cyan.inverse(
					`SGS KHADAMATI SAP ${process.env.SERVER_TYPE} SERVER IS UP AND RUNNING ON PORT ${port}`
				)
			);
			break;
		default:
			console.log(
				chalk.greenBright.inverse(
					`SGS KHADAMATI SAP ${process.env.SERVER_TYPE} SERVER IS UP AND RUNNING ON PORT ${port}`
				)
			);
	}
});
