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
		<div className="flex flex-row items-center w-1/2 md:w-1/3">
			<Input
				className="bg-blue-500 bg-opacity-30 dark:bg-white dark:bg-opacity-50 p-3 rounded-xl border-none text-lg
								focus-visible:bg-blue-400 focus-visible:bg-opacity-100 focus-visible:text-white"
				placeholder="Type in name of a city..."
				onChange={handleInput}
				type="text"
				value={searchInput}
			/>
		</div>
	);
}
