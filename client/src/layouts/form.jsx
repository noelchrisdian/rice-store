import { BackButton } from "../components/back";
import { Outlet } from "react-router-dom";

const FormLayout = () => {
	return (
		<main className="bg-background text-foreground font-sans min-h-screen">
			<BackButton type={"button"} path={-1} />
			<Outlet />
		</main>
	)
}

export {
    FormLayout
}