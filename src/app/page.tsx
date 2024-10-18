"use client";

import SearchBar from "@/components/SearchBar";
import ThemeToggler from "@/components/ThemeToggler";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import CityCard from "@/components/CityCard";
import { useDebounce } from "use-debounce";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import CustomTooltipHourly from "@/components/CustomTooltipHourly";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomTooltipDaily from "@/components/CustomTooltipDaily";
import CurrentWeatherCard from "@/components/currentWeatherCard";
import { Button } from "@/components/ui/button";

type CurreytCityType = {
	latitude: number;
	longitude: number;
	timezone: string;
};

type CurrentWeatherType = {
	is_day: number;
	temperature_2m: number;
	precipitation: number;
	relative_humidity_2m: number;
	weather_code: number;
	wind_speed_10m: number;
};

export default function Home() {
	const [searchInput, setSearchInput] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [isSearching, setIsSearching] = useState(false); // for searching city
	const [errorMsg, setErrorMsg] = useState("");
	const [activeCard, setActiveCard] = useState<null | number>(null);

	const [dailyForecast, setDailyForecast] = useState<object[]>([]);
	const [hourlyForecast, setHourlyForecast] = useState<object[]>([]);
	const [currentWeather, setCurrentWeather] = useState<CurrentWeatherType>({
		is_day: 0,
		temperature_2m: 0,
		precipitation: 0,
		relative_humidity_2m: 0,
		weather_code: 0,
		wind_speed_10m: 0,
	});

	const [currentCity, setCurrentCity] = useState<CurreytCityType>({
		latitude: 0,
		longitude: 0,
		timezone: "",
	});
	const [currentTab, setCurrentTab] = useState("hourly");

	const [isLoading, setIsLoading] = useState(false);
	const [isCelsius, setIsCelsius] = useState(true);

	const [query] = useDebounce(searchInput, 600);

	// save search term
	const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
		setSearchInput(event?.currentTarget?.value);
	};

	// show hourly first
	const handleClick = (
		index: number,
		lat: number,
		lon: number,
		timezone: string
	) => {
		if (activeCard === null || activeCard !== index) {
			setActiveCard(index);
			setCurrentTab("hourly");
			setCurrentCity({ latitude: lat, longitude: lon, timezone: timezone });
			searchCurrentWeather(lat, lon, timezone);
			searchHourlyForecast(lat, lon, timezone);
			searchDailyForecast(lat, lon, timezone);
		}
		// console.log(lat, lon, timezone);
		// searchDailyForecast(lat, lon, timezone);
	};

	const searchCurrentWeather = async (
		lat: number,
		lon: number,
		timezone: string,
		unit: string = "celsius"
	) => {
		setIsLoading(true);
		setIsCelsius(unit === "celsius" ? true : false);
		await axios(
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&temperature_unit=fahrenheit&timezone=${timezone}&temperature_unit=${unit}`
		).then((res) => {
			console.log(res.data.current);
			setCurrentWeather(res.data.current);
			setIsLoading(false);
		});
	};

	// search for daily forecast and history for the past week
	const searchDailyForecast = async (
		lat: number,
		lon: number,
		timezone: string,
		unit: string = "celsius"
	) => {
		setDailyForecast([]);
		setIsLoading(true);
		setIsCelsius(unit === "celsius" ? true : false);
		await axios(
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max&timezone=${timezone}&temperature_unit=${unit}`
		).then((res) => {
			setDailyForecast(parseDailyDataForRecharts(res.data.daily));
			// console.log(res.data.daily);
			setIsLoading(false);
		});
	};

	// search for hourly forecast data
	const searchHourlyForecast = async (
		lat: number,
		lon: number,
		timezone: string,
		unit: string = "celsius"
	) => {
		// clear array to repopulate with array with different unit, from celsius to fahrenheit
		setHourlyForecast([]);
		setIsLoading(true);
		setIsCelsius(unit === "celsius" ? true : false);
		await axios(
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code&timezone=${timezone}&forecast_days=2&temperature_unit=${unit}`
		).then((res) => {
			// console.log(res.data);
			const arr = parseHourlyDataForRecharts(res.data.hourly);
			setHourlyForecast(arr);
			setIsLoading(false);
		});
	};

	// type for rechart hourly forecast data
	type RechartHourlyObject = {
		apparent_temperature: number;
		temperature_2m: number;
		precipitation_probability: number;
		relative_humidity_2m: number;
		time: string;
		weather_code: number;
	};

	// type for rechart daily forecast data
	type RechartDailyObject = {
		apparent_temperature_max: number;
		apparent_temperature_min: number;
		temperature_2m_max: number;
		temperature_2m_min: number;
		precipitation_probability_max: number;
		time: string;
		weather_code: number;
	};

	const parseHourlyDataForRecharts = (object: {
		apparent_temperature: Array<number>;
		temperature_2m: Array<number>;
		precipitation_probability: Array<number>;
		relative_humidity_2m: Array<number>;
		time: Array<string>;
		weather_code: Array<number>;
	}) => {
		const arr = [];

		for (let i = 0; i < object.time.length; i++) {
			const chartObject = {} as RechartHourlyObject;
			chartObject.apparent_temperature = object.apparent_temperature[i];
			chartObject.temperature_2m = object.temperature_2m[i];
			chartObject.precipitation_probability =
				object.precipitation_probability[i];
			chartObject.relative_humidity_2m = object.relative_humidity_2m[i];
			chartObject.time = object.time[i].replace("T", " ");
			chartObject.weather_code = object.weather_code[i];
			arr.push(chartObject);
		}

		return arr;
		// returns an array of objects
	};

	const parseDailyDataForRecharts = (object: {
		apparent_temperature_max: Array<number>;
		apparent_temperature_min: Array<number>;
		temperature_2m_max: Array<number>;
		temperature_2m_min: Array<number>;
		precipitation_probability_max: Array<number>;
		time: Array<string>;
		weather_code: Array<number>;
	}) => {
		const arr = [];

		for (let i = 0; i < object.time.length; i++) {
			const chartObject = {} as RechartDailyObject;
			chartObject.apparent_temperature_max = object.apparent_temperature_max[i];
			chartObject.apparent_temperature_min = object.apparent_temperature_min[i];
			chartObject.temperature_2m_max = object.temperature_2m_max[i];
			chartObject.temperature_2m_min = object.temperature_2m_min[i];
			chartObject.precipitation_probability_max =
				object.precipitation_probability_max[i];
			chartObject.time = object.time[i].replace("T", " ");
			chartObject.weather_code = object.weather_code[i];
			arr.push(chartObject);
		}

		return arr;
		// returns an array of objects
	};

	useEffect(() => {
		// search city
		async function searchCities() {
			setIsSearching(true);
			await axios(
				`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`
			)
				.then((res) => {
					setSearchResult(res.data.results);
				})
				.then(() => setIsSearching(false))
				.catch((error) => {
					setErrorMsg(error);
				});
		}

		if (query) {
			searchCities();
		} else {
			setSearchResult([]);
		}
	}, [query]);

	return (
		<main className="flex flex-col gap-4 justify-center items-center">
			<nav className="flex flex-row justify-between p-4 mx-2 w-full">
				<div>Weather App</div>
				<div className="flex flex-row gap-4 items-center justify-center">
					<ThemeToggler />
					<a
						href="https://github.com/hongli-95/city_weather_graph"
						target="_blank"
					>
						<Button className="dark:bg-white rounded-md font-semibold">
							Github
						</Button>
					</a>
				</div>
			</nav>

			<div className="flex justify-center items-center w-full">
				<SearchBar handleInput={handleInput} searchInput={searchInput} />
			</div>

			<div className="flex flex-row flex-wrap justify-center items-center gap-4 p-4">
				{isSearching ? (
					<Loader2 className="animate-spin" size={36} />
				) : searchResult.length ? (
					searchResult.map((city, index) => (
						<CityCard
							key={index}
							active={index === activeCard}
							name={city["name"]}
							country={city["country"]}
							state={city["admin1"]}
							handleClick={() =>
								handleClick(
									index,
									city["latitude"],
									city["longitude"],
									city["timezone"]
								)
							}
						/>
					))
				) : null}
				{errorMsg && <div>{errorMsg}</div>}
			</div>

			{currentCity.latitude !== 0 &&
			currentCity.longitude !== 0 &&
			currentCity.timezone &&
			!isLoading ? (
				<div className="flex flex-col gap-5">
					<Select
						onValueChange={(val) => {
							if (val === "celsius") {
								setIsCelsius(true);
								searchCurrentWeather(
									currentCity?.latitude,
									currentCity?.longitude,
									currentCity?.timezone,
									val
								);
								searchHourlyForecast(
									currentCity?.latitude,
									currentCity?.longitude,
									currentCity?.timezone,
									val
								);
								searchDailyForecast(
									currentCity?.latitude,
									currentCity?.longitude,
									currentCity?.timezone,
									val
								);
							} else {
								setIsCelsius(false);
								searchCurrentWeather(
									currentCity?.latitude,
									currentCity?.longitude,
									currentCity?.timezone,
									val
								);
								searchHourlyForecast(
									currentCity?.latitude,
									currentCity?.longitude,
									currentCity?.timezone,
									val
								);
								searchDailyForecast(
									currentCity?.latitude,
									currentCity?.longitude,
									currentCity?.timezone,
									val
								);
							}
						}}
					>
						<SelectTrigger className="w-full">
							<SelectValue
								placeholder={isCelsius ? "Celsius °C" : "Fahrenheit °F"}
							/>
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Temperature Unit</SelectLabel>
								<SelectItem value="celsius">Celsius °C</SelectItem>
								<SelectItem value="fahrenheit">Fahrenheit °F</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<CurrentWeatherCard
						isDay={currentWeather.is_day ? true : false}
						temperature={currentWeather.temperature_2m}
						precipitation={currentWeather.precipitation}
						relativeHumidity={currentWeather.relative_humidity_2m}
						weatherCodeNum={currentWeather.weather_code}
						windSpeed={currentWeather.wind_speed_10m}
						isCelsius={isCelsius}
					/>
				</div>
			) : isLoading ? (
				<Loader2 className="animate-spin" />
			) : null}

			{/* hourly and daily forecast graph and info */}
			{hourlyForecast.length && !isLoading ? (
				<Tabs
					defaultValue={currentTab}
					className="md:w-[80%] flex flex-col items-center"
					onValueChange={(val) => {
						setCurrentTab(val);
					}}
				>
					<TabsList className="grid w-1/3 grid-cols-2 relative mb-4">
						<TabsTrigger value="hourly">2-Day Hourly Forecast</TabsTrigger>
						<TabsTrigger value="daily">7-Day Daily Forecast</TabsTrigger>
					</TabsList>

					<TabsContent value="hourly" className="w-full">
						<div className="h-96 flex justify-center flex-col items-center gap-4 p-4">
							<div className="ml-auto"></div>

							<ResponsiveContainer width="100%" height="100%">
								<LineChart width={500} height={300} data={hourlyForecast}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="time" name="time" />
									<YAxis
										yAxisId="left"
										label={{
											value: "Temperature",
											angle: -90,
											position: "insideLeft",
										}}
									/>
									<YAxis
										yAxisId="right"
										orientation="right"
										label={{
											value: "Precipitation %",
											angle: 90,
											position: "insideRight",
										}}
									/>
									<Tooltip content={<CustomTooltipHourly />} />
									<Legend />
									<Line
										type="monotone"
										dataKey="apparent_temperature"
										yAxisId="left"
										name="Temperature"
										stroke="#FFB343"
										unit={isCelsius ? "°C" : "°F"}
										activeDot={{ r: 2 }}
									/>
									<Line
										type="monotone"
										dataKey="precipitation_probability"
										yAxisId="right"
										name="Precipitation"
										stroke="#73CCD8"
										unit="%"
										activeDot={{ r: 2 }}
									/>
								</LineChart>
							</ResponsiveContainer>

							<div>{/* {hourlyForecast} */}</div>
						</div>
					</TabsContent>
					<TabsContent value="daily" className="w-full">
						<div className="h-96 flex justify-center flex-col items-center gap-4 p-4">
							<div className="ml-auto"></div>

							<ResponsiveContainer width="100%" height="100%">
								<LineChart width={500} height={300} data={dailyForecast}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="time" name="time" />
									<YAxis
										yAxisId="left"
										label={{
											value: "Temperature",
											angle: -90,
											position: "insideLeft",
										}}
									/>
									<YAxis
										yAxisId="right"
										orientation="right"
										label={{
											value: "Precipitation",
											angle: 90,
											position: "insideRight",
										}}
									/>

									<Tooltip content={<CustomTooltipDaily />} />
									<Legend />
									<Line
										type="monotone"
										dataKey="temperature_2m_max"
										yAxisId="left"
										name="High"
										stroke="#FFB343"
										unit={isCelsius ? "°C" : "°F"}
										activeDot={{ r: 2 }}
									/>
									<Line
										type="monotone"
										dataKey="temperature_2m_min"
										yAxisId="left"
										name="Low"
										stroke="#4169E1"
										unit={isCelsius ? "°C" : "°F"}
										activeDot={{ r: 2 }}
									/>
									<Line
										type="monotone"
										dataKey="precipitation_probability_max"
										yAxisId="right"
										name="precipitation"
										stroke="#73CCD8"
										unit="%"
										activeDot={{ r: 2 }}
									/>
								</LineChart>
							</ResponsiveContainer>

							<div>{/* {dailyForecast} */}</div>
						</div>
					</TabsContent>
				</Tabs>
			) : !hourlyForecast.length && isLoading ? (
				<div className="flex flex-col justify-center items-center gap-4">
					<p className="font-semibold text-lg">Loading graph...</p>
					<Loader2 className="animate-spin" size={36} />
				</div>
			) : null}
		</main>
	);
}
