type CityCardPropType = {
	name: string;
	country: string;
	state: string;
	active: boolean;
	handleClick: () => void;
};

export default function CityCard({
	name,
	country,
	state,
	active,
	handleClick,
}: CityCardPropType) {
	return (
		<div
			onClick={handleClick}
			tabIndex={0} // make this focusable
			className={`flex flex-col gap-2 p-4 rounded-md justify-center items-center cursor-pointer bg-blue-500
						dark:bg-slate-300 dark:bg-opacity-50
							hover:scale-105 focus-visible:scale-105
								transition-all
			${
				active
					? "bg-slate-500 drop-shadow-md text-white dark:bg-white dark:bg-opacity-90 dark:text-black scale-105"
					: "bg-slate-500 bg-opacity-50"
			}`}
		>
			<div>{name}</div>
			<div className="">
				{state}
				{state ? ", " : ""}
				{country}
			</div>
			<div></div>
		</div>
	);
}
