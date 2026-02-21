import secureLocalStorage from "react-secure-storage";
import {
	ClipboardList,
	House,
	LogIn,
	LogOutIcon,
	Package,
	ShoppingBag,
	UserPen,
	Users
} from "lucide-react";
import { Dropdown } from "antd";
import { getCustomer } from "../services/users";
import { getSession } from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const Navbar = ({ active, position }) => {
	const navigate = useNavigate();
	const session = getSession();
	const queryClient = useQueryClient();

	const handleLogout = () => {
		secureLocalStorage.removeItem("SESSION_KEY");
		queryClient.clear();
		navigate("/");
	}

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

	const handleClick = (e) => {
		if (!session) return;
		if (e.key === "change-profile") {
			navigate("/account/change-profile");
		} else if (e.key === "log-out") {
			handleLogout();
		}
	}

	const { data: user } = useQuery({
		queryKey: ["user-detail", session?.role],
		queryFn: () => {
			if (session?.role === "admin") return null;
			return getCustomer();
		},
		enabled: !!session && session?.role !== "admin",
		retry: false
	})

	return (
		<>
			{session?.role && session?.role === "customer" ? (
				<nav
					className={`fixed bg-card rounded-3xl shadow-2xl border border-border/50 z-50 ${
						position === "bottom" ? "bottom-5" : "top-5"
					} left-5 right-5 md:max-w-md md:bottom-12 md:mx-auto lg:bottom-auto`}>
					<div className="flex justify-around items-center px-3 h-14 gap-2">
						{active === "home" ? (
							<Link className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
								<House className="size-6" />
								<span className="text-sm font-medium">Beranda</span>
							</Link>
						) : (
							<Link
								to={"/"}
								className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
								<House className="size-6" />
							</Link>
						)}
						{active === "cart" ? (
							<Link className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
								<ShoppingBag className="size-6" />
								<span className="text-sm font-medium">Keranjang</span>
							</Link>
						) : (
							<Link
								to={"/cart"}
								className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
								<ShoppingBag className="size-6" />
							</Link>
						)}
						{active === "orders" ? (
							<Link className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
								<ClipboardList className="size-6" />
								<span className="text-sm font-medium">Transaksi</span>
							</Link>
						) : (
							<Link
								to={"/orders"}
								className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
								<ClipboardList className="size-6" />
							</Link>
						)}
						{position === "top" ? (
							<Dropdown
								className="cursor-pointer"
								placement="bottomLeft"
								trigger={["hover"]}
								menu={{ items, onClick: handleClick }}>
								<img
									src={user?.data?.avatar?.imageURL}
									className="w-7 h-7 rounded-full object-cover"
								/>
							</Dropdown>
						) : active === "account" ? (
							<Link className="flex items-center gap-2 p-0.5 rounded-full shadow-sm transition-all bg-primary text-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary/20">
								<img
									src={user?.data?.avatar?.imageURL}
									className="w-7 h-7 rounded-full object-cover"
								/>
							</Link>
						) : (
							<Link
								to={"/account"}
								className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
								<img
									src={user?.data?.avatar?.imageURL}
									className="w-7 h-7 rounded-full object-cover"
								/>
							</Link>
						)}
					</div>
				</nav>
			) : session?.role && session?.role === "admin" ? (
				<nav
					className={`fixed bg-card rounded-3xl shadow-2xl border border-border/50 z-50 ${
						position === "bottom" ? "bottom-5" : "top-5"
					} left-5 right-5 md:max-w-md md:bottom-12 md:mx-auto lg:bottom-auto`}>
					<div className="flex justify-around items-center px-3 h-14 gap-2">
						{active === "home" ? (
							<Link className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
								<House className="size-6" />
								<span className="text-sm font-medium">Beranda</span>
							</Link>
						) : (
							<Link
								to={"/admin"}
								className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
								<House className="size-6" />
							</Link>
						)}
						{active === "products" ? (
							<Link className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
								<Package className="size-6" />
								<span className="text-sm font-medium">Produk</span>
							</Link>
						) : (
							<Link
								to={"/admin/products"}
								className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
								<Package className="size-6" />
							</Link>
						)}
						{active === "orders" ? (
							<Link className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
								<ClipboardList className="size-6" />
								<span className="text-sm font-medium">Pesanan</span>
							</Link>
						) : (
							<Link
								to={"/admin/orders"}
								className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
								<ClipboardList className="size-6" />
							</Link>
						)}
						{active === "users" ? (
							<Link className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
								<Users className="size-6" />
								<span className="text-sm font-medium">Pengguna</span>
							</Link>
						) : (
							<Link
								to={"/admin/users"}
								className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
								<Users className="size-6" />
							</Link>
						)}
					</div>
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