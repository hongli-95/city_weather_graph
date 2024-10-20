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
	const now = new Date().toLocaleDateString(undefined, {
		weekday: "long",
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	return (
		<div
			className="flex flex-col justify-center items-center p-4 px-8 gap-4 text-black backdrop-blur-md bg-white/40
                        dark:bg-slate-300 dark:bg-opacity-50 rounded-md dark:text-white"
		>
			<div className="flex flex-col gap-2">
				<div className="font-semibold text-xl">
					<p>{now}</p>
				</div>
				<div className="flex flex-row justify-center items-center">
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
					<div>
						<p className="font-semibold text-xl">
							{isDay
								? weatherCode[`${weatherCodeNum}` as keyof typeof weatherCode]
										.day.description
								: weatherCode[`${weatherCodeNum}` as keyof typeof weatherCode]
										.night.description}
						</p>
						<p>
							<span className="font-semibold text-xl">
								{temperature} {isCelsius ? "°C" : "°F"}
							</span>
						</p>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2">
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
