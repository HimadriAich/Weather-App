const url = 'https://meteostat.p.rapidapi.com/point/monthly?lat=52.5244&lon=13.4105&alt=43&start=2020-01-01&end=2020-12-31';
const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'faa3815bf9msh8ef175723939246p17407djsn353c0688da06',
		'x-rapidapi-host': 'meteostat.p.rapidapi.com',
		'Content-Type': 'application/json'
	}
};


async function getWeather() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}
getWeather();
