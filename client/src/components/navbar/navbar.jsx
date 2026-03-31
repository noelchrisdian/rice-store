import {
	LogIn,
	LogOutIcon,
	UserPen
} from "lucide-react";
import { getCart } from "../../services/carts";
import { getCustomer } from "../../services/users";
import { getSession } from "../../utils/axios";
import { handleLogout } from "../../utils/logout";
import { Link, useNavigate } from "react-router-dom";
import { NavbarAdmin } from "./admin";
import { NavbarCustomer } from "./customer";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Navbar = ({ active, position }) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const items = [
		{
			key: "change-profile",
			className: "p-0! m-0!",
			label: (
				<div className="w-full px-4 py-3 flex items-center gap-3 rounded-lg hover:bg-secondary/60 transition-colors">
					<div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
						<UserPen className="size-6 text-primary" />
					</div>
					<div className="text-left">
						<p className="text-base font-semibold text-foreground">
							Ubah Profil
						</p>
						<p className="text-sm text-muted-foreground">
							Perbarui informasi personal Anda
						</p>
					</div>
				</div>
			)
		},
		{
			key: "log-out",
			className: "p-0! m-0!",
			label: (
				<div className="w-full px-4 py-3 flex items-center gap-3 rounded-lg hover:bg-secondary/60 transition-colors">
					<div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
						<LogOutIcon className="size-6 text-primary" />
					</div>
					<div className="text-left">
						<p className="text-base font-semibold text-foreground">
							Keluar
						</p>
						<p className="text-sm text-muted-foreground">
							Akhiri sesi akun Anda
						</p>
					</div>
				</div>
			)
		}
	]

	const { data: session } = useQuery({
		queryKey: ["session"],
		queryFn: getSession,
		retry: false
	})

	const handleClick = (e) => {
		if (!session) return;
		if (e.key === "change-profile") {
			navigate("/account/change-profile");
		} else if (e.key === "log-out") {
			handleLogout(queryClient, navigate);
		}
	}

	const { data: cartNavbar } = useQuery({
		queryKey: ["user-cart"],
		queryFn: async () => {
			if (session?.role === "admin") return null;
			const result = await getCart();
			return result.data;
		},
		enabled: !!session && session?.role !== "admin"
	})

	const { data: user } = useQuery({
		queryKey: ["user-detail", session?.role],
		queryFn: () => {
			if (session?.role === "admin") return null;
			return getCustomer();
		},
		enabled: !!session && session?.role !== "admin",
		retry: false
	})

	const cartItems = cartNavbar?.products.length;

	return (
		<>
			{session?.role && session?.role === "customer" ? (
				<nav
					className={`fixed bg-card rounded-3xl shadow-2xl border border-border/50 z-50 ${
						position === "bottom" ? "bottom-5" : "top-5"
					} left-5 right-5 md:max-w-md md:bottom-12 md:mx-auto lg:bottom-auto`}>
					<NavbarCustomer
						active={active}
						cartItems={cartItems}
						handleClick={handleClick}
						items={items}
						position={position}
						user={user}
					/>
				</nav>
			) : session?.role && session?.role === "admin" ? (
				<nav
					className={`fixed bg-card rounded-3xl shadow-2xl border border-border/50 z-50 ${
						position === "bottom" ? "bottom-5" : "top-5"
					} left-5 right-5 md:max-w-md md:bottom-12 md:mx-auto lg:bottom-auto`}>
					<NavbarAdmin active={active} />
				</nav>
			) : (
				<div className="px-4 pb-6 space-y-3">
					<Link
						to={"/sign-in"}
						className="fixed bottom-6 right-6 size-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-10 active:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50">
						<LogIn />
					</Link>
				</div>
			)}
		</>
	)
}

export {
	Navbar
}