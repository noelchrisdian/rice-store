import { ArrowLeft, FileText } from "lucide-react";
import { CustomerSection } from "./customer";
import { handleDate } from "../../../../utils/date";
import { ItemSection } from "./item";
import { Link, useRouteLoaderData } from "react-router-dom";
import { PaymentSection } from "./payment";
import { SellerSection } from "./seller";
import { setOrderStatus } from "../../../../utils/order";

const AdminDetailOrder = () => {
	const order = useRouteLoaderData("admin-order-detail");

	return (
		<main className="bg-background font-sans text-foreground min-h-screen pt-10 pb-2">
			<Link
				to={"/admin/orders"}
				className="fixed top-4 left-4 z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:top-6 lg:left-5">
				<ArrowLeft className="size-6" />
			</Link>
			<section className="px-4 pt-6 space-y-6 lg:max-w-3xl lg:mx-auto">
				<div className="bg-card rounded-2xl border border-border p-4 space-y-4">
					<div className="flex items-center justify-between">
						<div className="">
							<p className="text-sm text-muted-foreground">
								Status Pesanan
							</p>
							<p className="font-semibold text-foreground mt-1">
								{setOrderStatus(order?.payment?.status, order?.shipping?.status)}
							</p>
						</div>
						<div className="">
							<p className="text-xs text-muted-foreground tracking-wide">
								Tanggal Pesanan
							</p>
							<p className="text-sm text-foreground mt-1">
								{handleDate(order?.createdAt)}
							</p>
						</div>
					</div>
				</div>
				<ItemSection order={order} />
				<PaymentSection order={order} />
				<CustomerSection order={order} />
				<SellerSection />
				<div className="px-4 pb-6 space-y-3">
					<Link
						to={`/admin/orders/${order?._id}/invoice`}
						className="fixed bottom-6 right-6 size-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer active:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50">
						<FileText className="size-6" />
					</Link>
				</div>
			</section>
		</main>
	)
}

export {
	AdminDetailOrder
}