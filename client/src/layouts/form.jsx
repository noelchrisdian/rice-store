import { ArrowLeft } from "lucide-react";
import { useNavigate, Outlet } from "react-router-dom";

const FormLayout = () => {
	const navigate = useNavigate();

	return (
		<main className="bg-background text-foreground font-sans min-h-screen ">
			<button
				className="fixed top-4 left-4 z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:top-6 lg:left-5"
				onClick={() => navigate(-1)}>
				<ArrowLeft className="size-6 cursor-pointer" />
			</button>
			<Outlet />
		</main>
	)
}

export {
    FormLayout
}