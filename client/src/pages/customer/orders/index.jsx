import {
	ClipboardX,
	Eye,
	FileText
} from "lucide-react";
import { handleDate } from "../../../utils/date";
import { handleCurrency } from "../../../utils/price";
import {
	Link,
	useLoaderData,
	useSearchParams
} from "react-router-dom";
import { Navbar } from "../../../components/Navbar";
import { Pagination, Select } from "antd";

const CustomerOrders = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const orders = useLoaderData();
	const currentPage = Number(
		searchParams.get("page") || orders.meta.page || 1
	)
	const pageSize = Number(
		searchParams.get("limit") || orders.meta.limit || 10
	)
	const currentStatus = searchParams.get('status') || null;
	const currentRange = searchParams.get('range') || null;

	const statusOptions = [
		{ value: "success", label: "Berhasil" },
		{ value: "pending", label: "Pending" },
		{ value: "failed", label: "Gagal" }
	]

	const rangeOptions = [
		{ value: "today", label: "Hari Ini" },
		{ value: "7d", label: "7 Hari Terakhir" },
		{ value: "30d", label: "30 Hari Terakhir" },
		{ value: "90d", label: "90 Hari Terakhir" }
	]

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"orders"} position={"top"} />
			</section>
			<main className="bg-background font-sans text-foreground min-h-screen">
				<section className="pt-6 pb-28 px-6 lg:py-20 lg:max-w-5xl lg:mx-auto">
					<div className="mb-4">
						<div className="grid grid-cols-2 gap-4 lg:pt-10 lg:pb-1">
							<div className="flex-1">
								<Select
									className="w-full! p-0!"
									placeholder={"Status Pesanan"}
									allowClear
									options={statusOptions}
									value={currentStatus}
									onChange={(value) => {
										const params = new URLSearchParams(searchParams);

										if (value) {
											params.set("status", value);
										} else {
											params.delete("status");
										}

										params.set("page", "1");
										setSearchParams(params);
									}}
								/>
							</div>
							<div className="flex-1">
								<Select
									className="w-full! p-0!"
									placeholder={"Rentang Waktu"}
									allowClear
									options={rangeOptions}
									value={currentRange}
									onChange={(value) => {
										const params = new URLSearchParams(searchParams);

										if (value) {
											params.set("range", value);
										} else {
											params.delete("range");
										}

										params.set("page", "1");
										setSearchParams(params);
									}}
								/>
							</div>
						</div>
					</div>
					{orders?.orders.length > 0 ? (
						<>
							<div className="space-y-3 pt-1 pb-4 lg:grid lg:grid-cols-1 lg:gap-1 lg:pt-0 ">
								{orders.orders.map((order, index) => (
									<div
										className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
										key={index}>
										<div
											className={`p-3 ${
												order.products.length > 1
													? "space-y-2"
													: "space-y-1"
											}`}>
											<div className="flex items-start justify-between">
												<img
													src={
														order.products[0]?.product?.image
															?.imageURL
													}
													alt=""
													className="size-16 rounded-xl object-cover bg-muted"
												/>
												<span
													className={`text-xs px-2.5 py-1.5 rounded-md ${
														order?.status === "success"
															? "bg-primary/10 text-primary"
															: order?.status === "pending"
																? "bg-orange-100 text-orange-700"
																: "bg-destructive/10 text-destructive"
													} font-medium whitespace-nowrap`}>
													{order?.status === "success"
														? "Berhasil"
														: order?.status === "pending"
															? "Pending"
															: "Gagal"}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-start">
													<div className="flex-1 min-w-0">
														<h3 className="font-semibold text-foreground text-base">
															{order.products[0]?.product?.name}
														</h3>
														<p className="text-sm text-muted-foreground">
															{order.products.length > 1
																? `+ ${
																		order.products.length - 1
																	} lainnya`
																: ""}
														</p>
													</div>
												</div>
											</div>
											<div className="flex items-start justify-between gap-2">
												<div className="flex-1 min-w-0">
													<p className="text-sm text-muted-foreground">
														{handleDate(order?.createdAt)}
													</p>
												</div>
											</div>
											<div className="flex items-center justify-between pt-1">
												<div className="">
													<p className="font-font-heading text-lg font-bold text-primary">
														{handleCurrency(order?.totalPrice)}
													</p>
												</div>
												<div className="flex items-center gap-2">
													<Link
														to={`/orders/${order._id}`}
														className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold text-sm flex items-center gap-1.5 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
														<Eye className="size-4" />
													</Link>
													<Link
														to={`/orders/${order._id}/invoice`}
														className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center gap-1.5 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
														<FileText className="size-4"/>
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
						<section className="absolute inset-0 flex items-center justify-center">
							<div className="text-center max-w-md mx-auto">
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
	CustomerOrders
}