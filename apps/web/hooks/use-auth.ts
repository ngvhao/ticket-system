import { useState } from "react";

const useAuth = () => {
	const userIdFromStorage = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
	const [user] = useState<{ id: number; name: string }>(() => {
		const id = userIdFromStorage ? parseInt(userIdFromStorage, 10) : Math.floor(Math.random() * 1000);
		return {
			id,
			name: `User${id}`,
		};
	});

	return {
		isAuthenticated: true,
		user,
	};
};

export default useAuth;