import { CircularLoading } from "respinner";

const Loader = ({ color, size }) => {
	return (
		<section className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
			<CircularLoading color={color} size={size} />
		</section>
	)
}

export {
    Loader
}