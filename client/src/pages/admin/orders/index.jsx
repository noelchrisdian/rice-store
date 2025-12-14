import {
	ClipboardX,
	Eye,
	Printer,
	Search
} from "lucide-react";
import {
	Input,
	Pagination,
	Select
} from "antd";
import {
	Link,
	useLoaderData,
	useSearchParams
} from "react-router-dom";
import { Navbar } from "../../../components/Navbar";
import { handleDate } from "../../../utils/date";
import { handleCurrency } from "../../../utils/price";

const AdminOrders = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const orders = useLoaderData();
	const currentPage = Number(
		searchParams.get("page") || orders.meta.page || 1
	)
	const pageSize = Number(
		searchParams.get("limit") || orders.meta.limit || 10
	)

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"orders"} position={"top"} />
			</section>
			<main className="bg-background font-sans text-foreground min-h-screen">
				<section className="pt-6 pb-28 px-6 lg:py-20">
					<div className="mb-6 lg:grid lg:grid-cols-2 lg:gap-2 lg:items-center">
						<div className="space-y-3 pb-3 lg:pt-10 lg:pb-1">
							<div className="relative">
								<Input
									type="text"
									className="w-full! pl-11! pr-4! py-3! rounded-xl! bg-input! border-0! text-foreground! placeholder:text-muted-foreground! lg:py-1.5!"
									suffix={
										<Search className="size-5 text-muted-foreground absolute left-3.5" />
									}
									placeholder="Cari berdasarkan nama pelanggan"
								/>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-2 lg:pt-10 lg:pb-1">
							<div className="flex-1">
								<Select
									className="w-full!"
									placeholder={"Pilih Status Pesanan"}
									allowClear
									options={[
										{ value: "success", label: "Sukses" },
										{ value: "pending", label: "Pending" },
										{ value: "cancelled", label: "Batal" }
									]}
								/>
							</div>
							<div className="flex-1">
								<Select
									className="w-full!"
									placeholder={"Pilih Rentang Waktu"}
									allowClear
									options={[
										{ value: "today", label: "Hari Ini" },
										{ value: "7d", label: "7 Hari Terakhir" },
										{ value: "30d", label: "30 Hari Terakhir" },
										{ value: "90d", label: "90 Hari Terakhir" }
									]}
								/>
							</div>
						</div>
					</div>
					{orders?.orders.length > 0 ? (
						<>
							<div className="space-y-3 pt-1 pb-4 lg:grid lg:grid-cols-1 lg:gap-4 lg:pt-0 ">
								{orders.orders.map((order, index) => (
									<div
										className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
										key={index}>
										<div className="p-3 space-y-2">
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-foreground text-base">
														{order?.user?.name}
													</h3>
													<p className="text-sm text-muted-foreground">
														{handleDate(order?.createdAt)} •{" "}
														{order?.products.length} item
													</p>
												</div>
												<span
													className={`text-xs px-2.5 py-1.5 rounded-md ${
														order?.status === "success"
															? "bg-primary/10 text-primary"
															: order?.status === "pending"
															? "bg-orange-100 text-orange-700"
															: "bg-destructive/10 text-destructive"
													} font-medium whitespace-nowrap`}>
													{order?.status === "success"
														? "Sukses"
														: order?.status === "pending"
														? "Pending"
														: "Batal"}
												</span>
											</div>
											<div className="flex items-center justify-between pt-1">
												<div className="">
													<p className="font-font-heading text-lg font-bold text-primary">
														{handleCurrency(order?.totalPrice)}
													</p>
												</div>
												<div className="flex items-center gap-2">
													<Link
														to={`/admin/orders/${order._id}`}
														className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold text-sm flex items-center gap-1.5 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
														<Eye className="size-4" />
													</Link>
													<Link className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center gap-1.5 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
														<Printer className="size-4" />
													</Link>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
							<Pagination
								className="pb-3"
								align="center"
								current={currentPage}
								pageSize={pageSize}
								showSizeChanger
								total={orders?.meta?.total}
								onChange={(page, pageSize) => {
									const params = new URLSearchParams(searchParams);
									params.set("limit", String(pageSize));
									params.set("page", String(page));
									setSearchParams(params);
								}}
							/>
						</>
					) : (
						<section className="flex-1 flex items-center justify-center py-16">
							<div className="text-center px-6 max-w-md mx-auto">
								<div className="inline-flex items-center justify-center size-24 bg-muted rounded-full mb-6 lg:size-32">
									<ClipboardX className="size-12 text-muted-foreground lg:size-16" />
								</div>
								<h3 className="font-font-heading text-2xl font-bold text-primary mb-3 lg:text-3xl">
									Pesanan Tidak Ditemukan
								</h3>
							</div>
						</section>
					)}
				</section>

			</main>
			<section className="lg:hidden">
				<Navbar active={"orders"} position={"bottom"} />
			</section>
		</>
	)
}

export {
	AdminOrders
}