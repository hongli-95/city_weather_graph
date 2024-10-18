// these 2 imports are for types
import { TooltipProps } from "recharts";
import { weatherCode } from "@/lib/weatherCode";
import {
	ValueType,
	NameType,
} from "recharts/types/component/DefaultTooltipContent";
import Image from "next/image";

export default function CustomTooltipDaily({
	active,
	payload,
	label,
}: TooltipProps<ValueType, NameType>) {
	if (active && payload && payload.length) {
		return (
			<div className="custom-tooltip text-black bg-slate-400 p-4 rounded-md bg-opacity-60 dark:text-black dark:bg-slate-50 dark:bg-opacity-70">
				<p>{label}</p>
				<div className="flex flex-row justify-start items-center">
					<Image
						width={60}
						height={60}
						src={
							weatherCode[
								`${payload[0].payload.weather_code}` as keyof typeof weatherCode
							].day.image
						}
						alt="image for weather code"
					></Image>
					<p>
						{
							weatherCode[
								`${payload[0].payload.weather_code}` as keyof typeof weatherCode
							].day.description
						}
					</p>
				</div>

				<p>
					{payload[0].name}: {payload[0].value} {payload[0].unit}
				</p>
				<p>
					{payload[1].name}: {payload[1].value}
					{payload[1].unit}
				</p>
				<p>
					{payload[2].name}: {payload[2].value} {payload[2].unit}
				</p>
			</div>
		);
	}
	return null;
}
