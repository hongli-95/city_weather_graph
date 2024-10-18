"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function ThemeToggler() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
			{theme === "light" ? <Moon /> : <Sun />}
		</Button>
	);
}
