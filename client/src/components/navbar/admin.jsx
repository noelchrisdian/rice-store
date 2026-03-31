import {
    ClipboardList,
    House,
    Package,
    Users
} from "lucide-react";
import { Link } from "react-router-dom";

const NavbarAdmin = ({ active }) => {
	return (
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
	)
}

export {
    NavbarAdmin
}