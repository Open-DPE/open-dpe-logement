import { useStore } from "@nanostores/react";
import { $user } from "@/stores/user";

export const useUser = () => {
	const { diagnostic, simulation } = useStore($user);
	return { diagnostic, simulation };
};
