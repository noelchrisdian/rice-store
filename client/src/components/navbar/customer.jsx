import {
    ClipboardList,
    House,
    ShoppingBag
} from "lucide-react";
import { Dropdown } from "antd";
import { Link } from "react-router-dom";

const NavbarCustomer = ({
	active,
	cartItems,
	handleClick,
	items,
	position,
	user
}) => {
	return (
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
					{cartItems > 0 ? (
						<div className="relative">
							<div className="absolute flex justify-center items-center -top-1 -right-1 w-4 h-4 p-2 rounded-full bg-primary-foreground">
								<span className="text-primary text-[9.5px]">
									{cartItems}
								</span>
							</div>
							<ShoppingBag className="size-6" />
						</div>
					) : (
						<ShoppingBag className="size-6" />
					)}
					<span className="text-sm font-medium">Keranjang</span>
				</Link>
			) : (
				<Link
					to={"/cart"}
					className="flex items-center justify-center size-12 text-primary transition-colors rounded-full active:bg-secondary/50">
					{cartItems > 0 ? (
						<div className="relative">
							<div className="absolute flex justify-center items-center -top-1 -right-1 w-4 h-4 p-2 rounded-full bg-primary">
								<span className="text-primary-foreground text-[9.5px]">
									{cartItems}
								</span>
							</div>
							<ShoppingBag className="size-6" />
						</div>
					) : (
						<ShoppingBag className="size-6" />
					)}
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
	)
}

export {
    NavbarCustomer
}