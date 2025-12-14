import secureLocalStorage from "react-secure-storage";
import {
	ClipboardList,
	House,
	Package,
	Settings,
	Users,
	UserPen,
	LogOutIcon,
} from "lucide-react";
import { Dropdown } from "antd";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ active, position }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		secureLocalStorage.removeItem("SESSION_KEY");
		navigate("/sign-in");
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
		if (e.key === "change-profile") {
			navigate("/admin/change-profile");
		} else if (e.key === "log-out") {
			handleLogout();
		}
	}

	return (
		<nav
			className={`fixed bg-card rounded-3xl shadow-2xl border border-border/50 z-50 ${
				position === "bottom" ? "bottom-8" : "top-5"
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
				{position === "top" ? (
					<Dropdown
						className="cursor-pointer"
						placement="bottomLeft"
						trigger={["hover"]}
						menu={{ items, onClick: handleClick }}>
						<Settings className="size-6 text-primary" />
					</Dropdown>
				) : active === "settings" ? (
					<Link className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm transition-all bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
						<Settings className="size-6" />
						<span className="text-sm font-medium">Pengaturan</span>
					</Link>
				) : (
					<Link
						to={"/admin/settings"}
						className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
						<Settings className="size-6" />
					</Link>
				)}
			</div>
		</nav>
	)
}

export {
	Navbar
}