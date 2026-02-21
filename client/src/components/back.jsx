import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const BackButton = ({ type, path }) => {
	const navigate = useNavigate();

	return (
		<>
			{type === "button" ? (
				<button
					className="fixed top-4 left-4 z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:top-6 lg:left-5"
					onClick={() => navigate(path)}>
					<ArrowLeft className="size-6" />
				</button>
			) : (
				<Link
					to={path}
					className="fixed top-4 left-4 z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:top-6 lg:left-5">
					<ArrowLeft className="size-6" />
				</Link>
			)}
		</>
	)
}

export {
    BackButton
}