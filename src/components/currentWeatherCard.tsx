import Image from "next/image";
import { weatherCode } from "@/lib/weatherCode";

type CurrentWeatherCardPropsType = {
	isDay: boolean;
	temperature: number;
	precipitation: number;
	relativeHumidity: number;
	weatherCodeNum: number;
	windSpeed: number;
	isCelsius: boolean;
};

export default function CurrentWeatherCard({
	isDay,
	temperature,
	precipitation,
	relativeHumidity,
	weatherCodeNum,
	windSpeed,
	isCelsius,
}: CurrentWeatherCardPropsType) {
	return (
		<div
			className="flex flex-row justify-center items-center p-4 gap-4 bg-blue-500 text-white
                        dark:bg-slate-300 dark:bg-opacity-50 rounded-md"
		>
			<div className="flex flex-col gap-2">
				<div>
					<Image
						alt="weather icon"
						width={80}
						height={0}
						src={
							isDay
								? weatherCode[`${weatherCodeNum}` as keyof typeof weatherCode]
										.day.image
								: weatherCode[`${weatherCodeNum}` as keyof typeof weatherCode]
										.night.image
						}
					></Image>
					<p>
						{isDay
							? weatherCode[`${weatherCodeNum}` as keyof typeof weatherCode].day
									.description
							: weatherCode[`${weatherCodeNum}` as keyof typeof weatherCode]
									.night.description}
					</p>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<p>
					Temperature:{" "}
					<span className="font-semibold">
						{temperature} {isCelsius ? "°C" : "°F"}
					</span>
				</p>
				<p>
					Precipitation:{" "}
					<span className="font-semibold">{precipitation} %</span>
				</p>
				<p>
					Relative Humidity:{" "}
					<span className="font-semibold">{relativeHumidity} %</span>{" "}
				</p>

				<p>
					Wind Speed: <span className="font-semibold">{windSpeed} km/h</span>
				</p>
			</div>
		</div>
	);
}
