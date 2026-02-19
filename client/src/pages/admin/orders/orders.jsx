import { Eye, FileText } from "lucide-react";
import { handleCurrency } from "../../../utils/price";
import { handleDate } from "../../../utils/date";
import { Link } from "react-router-dom";
import { Pagination } from "antd";
import { setOrderStatus } from "../../../utils/order";

const OrderSection = ({
	limit,
	orders,
	page,
	searchParams,
	setSearchParams
}) => {
	const styles = {
		"Dibatalkan": "bg-destructive/10 text-desctructive",
		"Telah Diterima": "bg-primary/10 text-primary",
		"Dikirim": "bg-blue-100 text-blue-700",
		"default": "bg-orange-100 text-orange-700"
	}

	return (
		<>
			<div className="space-y-3 pt-1 pb-4 lg:grid lg:grid-cols-1 lg:gap-1 lg:pt-0 ">
				{orders?.orders?.map((order, index) => {
					const status = setOrderStatus(
						order?.payment?.status,
						order?.shipping?.status
					)
					const currentStyle = styles[status] || styles["default"];

					return (
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
										className={`text-xs px-2.5 py-1.5 rounded-md  font-medium whitespace-nowrap ${currentStyle}`}>
										{status}
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
										<Link
											to={`/admin/orders/${order?._id}/invoice`}
											className="px-3 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
											<FileText className="size-4" />
										</Link>
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>
			<Pagination
				className="pb-3"
				align="center"
				current={page}
				pageSize={limit}
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
	)
}

export {
	OrderSection
}