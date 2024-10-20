"use client";

import { Input } from "./ui/input";

type SearchBarPropsType = {
	handleInput: (event: React.FormEvent<HTMLInputElement>) => void;
	searchInput: string;
};

export default function SearchBar({
	handleInput,
	searchInput,
}: SearchBarPropsType) {
	return (
		<div className="flex flex-row items-center w-1/2 md:w-1/3 backdrop-blur-sm">
			<Input
				className="bg-slate-400/40 dark:bg-white/40 backdrop-blur-md p-3 rounded-xl border-none text-lg
								focus-visible:bg-slate-300/40 focus-visible:bg-opacity-100 focus-visible:text-white
									dark:focus-visible:bg-opacity-100 dark:focus-visible:bg-white/60"
				placeholder="Type in name of a city..."
				onChange={handleInput}
				type="text"
				pattern="/^[a-zA-Z]+$/"
				value={searchInput}
			/>
		</div>
	);
}
