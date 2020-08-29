const form = document.getElementById("vote-form");
let totalVotes = 0;

const getVotes = async()=>{
	try {
		const data = await fetch("poll");
		const {votes} = await data.json();
		const voteCounts = votes.reduce((acc,vote)=>{
			acc[vote.os] = vote.points;
			totalVotes= totalVotes+vote.points;
			return acc;
		},{});
		let dataPoints = [
			{ label: "Windows", y: voteCounts["Windows"] },
			{ label: "MacOS", y: voteCounts["MacOS"] },
			{ label: "Linux", y: voteCounts['Linux'] },
			{ label: "Other", y: voteCounts['Other'] },
		];

		const chartContainer = document.querySelector("#chartContainer");

		if (chartContainer) {
			const chart = new CanvasJS.Chart("chartContainer", {
				animationEnabled: true,
				theme: "light1",
				title: {
					text: `Total Votes: ${totalVotes}`,
				},
				axisY: {
					title: "No of Votes",
				},
				axisX:{
					title: "Operating System"
				},
				data: [
					{
						type: "column",
						dataPoints: dataPoints,
					},
				],
			});
			chart.render();

			Pusher.logToConsole = true; //writes logs for pusher

			var pusher = new Pusher("94cdd794fd8aed01270d", {
				cluster: "ap2",
			});

			/* we subscribe to os-poll channel and bind to os-vote event and use the data sent from server side pusher on form submission which triggered this event in this channel */
			var channel = pusher.subscribe("os-poll");
			channel.bind("os-vote", (data) => {
				totalVotes = 0;
				dataPoints.forEach((dataPoint) => {
					if (dataPoint.label == data.os) dataPoint.y += data.points;
					totalVotes = totalVotes + dataPoint.y;
				});
				chart.options.title = { text: `Total Votes: ${totalVotes}` };
				chart.render();
				console.log(chart.options);
			});
		}

	} catch (error) {
		console.log(error);
	}
}
const postVote = async (data)=>{
    try {
        const response = await fetch("poll", {
			method: "post",
			body: JSON.stringify(data),
			headers: new Headers({
				"Content-Type": "application/json",
			}),
        });
        const receivedData = await response.json();
        console.log(receivedData);
        return receivedData;
    } catch (error) {
        console.log(error);
    }
}

form.addEventListener('submit', async (e)=>{
    const selectedOption = document.querySelector("input[name=os]:checked").value;
    const data = {os:selectedOption};
    e.preventDefault();
    await postVote(data);
});

getVotes();



