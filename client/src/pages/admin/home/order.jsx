import { handleCurrency } from "../../../utils/price";
import { Link } from "react-router-dom";
import { setOrderStatus } from "../../../utils/order";

const OrderSection = ({ recentOrders }) => {
	return (
		<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-font-heading text-2xl font-semibold text-foreground">
					Pesanan Terbaru
				</h3>
				<Link
					to={"/admin/orders"}
					className="text-primary text-sm font-medium active:text-primary/80 focus:outline-none focus:underline">
					Lihat semua
				</Link>
			</div>
			<div className="flex flex-col gap-3">
				{recentOrders?.data.map((order) => (
					<div
						className="flex items-center justify-between bg-muted rounded-xl p-3"
						key={order?._id}>
						<div className="flex items-center gap-3">
							<div className="">
								<p className="font-semibold text-foreground text-sm">
									{order?.user?.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{order?.products.length} item •{" "}
									{handleCurrency(order?.totalPrice)}
								</p>
							</div>
						</div>
						<span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
							{setOrderStatus(
								order?.payment?.status,
								order?.shipping?.status
							)}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export {
    OrderSection
}