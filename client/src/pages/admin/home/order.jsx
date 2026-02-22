import { ClipboardX, Eye } from "lucide-react";
import { handleCurrency } from "../../../utils/price";
import { Link } from "react-router-dom";
import { setOrderStatus } from "../../../utils/order";

const OrderSection = ({ recentOrders }) => {
	const styles = {
		"Dibatalkan": "bg-destructive/10 text-desctructive",
		"Telah Diterima": "bg-primary/10 text-primary",
		"Dikirim": "bg-blue-100 text-blue-700",
		"default": "bg-orange-100 text-orange-700"
	}

	return (
		<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5">
			{recentOrders?.data.length > 0 ? (
				<>
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
						{recentOrders?.data.map((order) => {
							const status = setOrderStatus(
								order?.payment?.status,
								order?.shipping?.status
							)
							const currentStyle = styles[status] || styles["default"];
							return (
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
									<div className="flex items-center gap-3">
										<span
											className={`text-xs font-medium px-2.5 py-1 rounded-full ${currentStyle}`}>
											{status}
										</span>
										<Link to={`/admin/orders/${order?._id}`} className="bg-white p-2 border border-border rounded-xl flex items-center justify-center text-muted-foreground transition-all shadow-sm active:text-primary">
											<Eye className="size-5" />
										</Link>
									</div>
								</div>
							)
						})}
					</div>
				</>
			) : (
				<>
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-heading text-xl font-semibold text-foreground">
							Pesanan Terbaru
						</h3>
					</div>
					<div className="py-10 flex flex-col items-center text-center px-4">
						<div className="size-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4">
							<ClipboardX className="size-8" />
						</div>
						<h4 className="font-heading text-lg font-semibold mb-1">
							Belum ada pesanan
						</h4>
						<p className="text-sm text-muted-foreground">
							Daftar pesanan akan ditampilkan di sini segera setelah ada pembelian dari pelanggan
						</p>
					</div>
				</>
			)}
		</div>
	)
}

export {
	OrderSection
}