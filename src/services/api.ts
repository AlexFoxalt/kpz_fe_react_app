import { useState } from "react";
import ErrorPopup from "../components/ErrorPopup";

export const fetchData = async (
	endpoint: string,
	options: RequestInit = {}
) => {
	const token = localStorage.getItem("token");
	const headers = {
		...options.headers,
		Authorization: token,
	};

	const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
		...options,
		headers,
	});

	if (!response.ok) {
		throw new Error(`Error: ${response.statusText}`);
	}
	return response.json();
};
