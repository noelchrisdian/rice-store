import secureLocalStorage from "react-secure-storage";
import {
	BanknoteArrowDown,
	ClipboardList,
	LogOut,
	Pencil,
	ShieldUser
} from "lucide-react";
import {
	getRecentOrders,
	getRecentProducts,
	getRecentUsers,
	getTodayOrders,
	getUserStats
} from "../../../services/dashboard";
import { handleCurrency } from "../../../utils/price";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../../components/loader";
import { Navbar } from "../../../components/navbar";
import { OrderSection } from "./order";
import { ProductSection } from "./product";
import { socket } from "../../../utils/socket";
import { toast } from "sonner";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserSection } from "./user";

const AdminHome = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const handleLogout = () => {
		secureLocalStorage.removeItem("SESSION_KEY");
		queryClient.clear();
		navigate("/");
	}

	const { data: todayOrders, isFetching: fetchingOrders } = useQuery({
		queryKey: ["orders", "today"],
		queryFn: () => getTodayOrders(),
		staleTime: 2 * 60 * 1000,
		refetchInterval: 0
	})

	const { data: recentOrders, isFetching: fetchingRecentOrders } = useQuery({
		queryKey: ["orders", "recent"],
		queryFn: () => getRecentOrders(),
		staleTime: 2 * 60 * 1000,
		refetchInterval: 0
	})

	const { data: recentProducts, isFetching: fetchingProducts } = useQuery({
		queryKey: ["products"],
		queryFn: () => getRecentProducts()
	})

	const { data: recentUsers, isFetching: fetchingUsers } = useQuery({
		queryKey: ["users", "recent"],
		queryFn: () => getRecentUsers(),
		staleTime: 5 * 60 * 1000,
		refetchInterval: 5 * 60 * 1000
	})

	const { data: userStats, isFetching: fetchingUserStats } = useQuery({
		queryKey: ["users", "stats"],
		queryFn: () => getUserStats(),
		staleTime: 5 * 60 * 1000,
		refetchInterval: 5 * 60 * 1000
	})

	const fetchingData =
		fetchingOrders ||
		fetchingRecentOrders ||
		fetchingProducts ||
		fetchingUsers ||
		fetchingUserStats

	useEffect(() => {
		const handler = (data) => {
			switch (data.type) {
				case "CANCELLED":
				case "PAID":
					queryClient.invalidateQueries({ queryKey: ["orders"] });
					break;
				case "CREATED":
					toast.success("Ada pesanan baru!");
					queryClient.invalidateQueries({ queryKey: ["orders"] });
			}
		}

		socket.emit("join:admin");
		socket.on("orders:event", handler);

		return () => {
			socket.off("orders:event", handler);
		}
	}, [queryClient])

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"home"} position={"top"} />
			</section>
			<main className="bg-background text-foreground font-sans flex flex-col min-h-screen pt-6 pb-20 lg:pt-24 lg:pb-4">
				<div className="lg:w-full lg:max-w-300 lg:mx-auto">
					<div className="px-4 mb-3">
						<div className="bg-linear-to-br from-primary to-primary/80 rounded-2xl relative overflow-hidden p-6">
							<div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
							<div className="absolute bottom-0 left-0 size-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl" />
							<div className="relative z-10 flex justify-between items-start">
								<div className="">
									<div className="size-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 mb-3">
										<ShieldUser className="size-8 text-white" />
									</div>
									<h2 className="font-font-heading text-2xl text-white mb-1">
										Selamat datang, Admin!
									</h2>
								</div>
								<div className="flex flex-col gap-2">
									<Link
										to={"/admin/change-profile"}
										className="size-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 active:bg-white/30">
										<Pencil className="size-4" />
									</Link>
									<button
										className="size-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 active:bg-white/30"
										onClick={() => handleLogout()}>
										<LogOut className="size-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
					{fetchingData ? (
						<Loader color={"#3D6F2E"} size={90} />
					) : (
						<>
							<div className="grid grid-cols-2 gap-3 mb-3 px-4">
								<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4">
									<div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
										<ClipboardList className="size-6 text-primary" />
									</div>
									<p className="font-font-heading text-2xl font-bold text-foreground mb-1">
										{todayOrders?.data?.orders || 0}
									</p>
									<p className="text-sm text-muted-foreground">
										Pesanan Hari Ini
									</p>
								</div>
								<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4">
									<div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
										<BanknoteArrowDown className="size-6 text-primary" />
									</div>
									<p className="font-font-heading text-2xl font-bold text-foreground mb-1">
										{handleCurrency(todayOrders?.data?.income || 0)}
									</p>
									<p className="text-sm text-muted-foreground">
										Pendapatan Hari Ini
									</p>
								</div>
							</div>
							<div className="lg:grid lg:grid-cols-3">
								<div className="px-4 mb-3 lg:pl-4 lg:pr-2">
									<ProductSection recentProducts={recentProducts} />
								</div>
								<div className="grid grid-cols-1 gap-3 px-4 mb-3 lg:px-2">
									<OrderSection recentOrders={recentOrders} />
								</div>
								<div className="px-4 mb-3 lg:pl-2 lg:pr-4">
									<UserSection
										recentUsers={recentUsers}
										userStats={userStats}
									/>
								</div>
							</div>
						</>
					)}
				</div>
			</main>
			<section className="lg:hidden">
				<Navbar active={"home"} position={"bottom"} />
			</section>
		</>
	)
}

export {
	AdminHome
}