import { ArrowLeft, Printer } from "lucide-react";
import { handleCurrency } from "../../../utils/price";
import { handleDate } from "../../../utils/date";
import { setPaymentStatus } from "../../../utils/order";
import { useNavigate } from "react-router-dom";
import { useRouteLoaderData } from "react-router-dom";

const OrderInvoice = ({ role }) => {
	const adminOrder = useRouteLoaderData('admin-order-detail')
	const customerOrder = useRouteLoaderData("order-detail");
	const navigate = useNavigate();
	const order = role === 'admin' ? adminOrder : customerOrder;

	return (
		<main className="min-h-screen bg-background text-foreground font-sans pb-4 relative">
			<button
				onClick={() => navigate(-1)}
				className="fixed top-4 left-4 z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:top-6 lg:left-5 print:hidden">
				<ArrowLeft className="size-6" />
			</button>
			<button
				className="fixed bottom-6 right-6 size-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer active:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 print:hidden"
				onClick={() => window.print()}>
				<Printer />
			</button>
			<div className="px-4 pt-14 pb-6 print:pt-2 lg:max-w-xl lg:mx-auto">
				<div className="bg-card rounded-2xl border border-border/50 overflow-hidden pb-6 px-6 pt-8 mb-2 print:border-none print:bg-none">
					<div className="text-center mb-6 pb-6 border-b border-border">
						<h1 className="font-heading uppercase text-3xl font-bold text-primary tracking-widest">
							Invoice
						</h1>
					</div>
					<div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
						<div>
							<h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
								Dari
							</h3>
							<p className="font-semibold text-foreground mb-1">
								Toko Beras AD
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Jalan Kedung Ombo A46 Magelang, Jawa Tengah 56172 <br />
								noel@tokoberasad.com <br />
								+6281229965129
							</p>
						</div>
						<div>
							<h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
								Untuk
							</h3>
							<p className="font-semibold text-foreground mb-1">
								{order?.user?.name}
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{order?.user?.address}
								<br />
								{order?.user?.email}
								<br />
								{order?.user?.phoneNumber}
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-border">
						<div>
							<h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
								Tanggal Pesanan
							</h3>
							<p className="text-sm text-foreground">
								{handleDate(order?.createdAt)}
							</p>
						</div>
						<div>
							<h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
								Status Pembayaran
							</h3>
							<p className="text-sm text-foreground">
								{setPaymentStatus(order?.payment?.status)}
							</p>
						</div>
					</div>
					<div className="mb-6">
						<h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
							Item Pesanan
						</h3>
						<div className="space-y-3">
							{order?.products?.map((item, index) => (
								<div
									className="flex items-start gap-3 p-3 bg-muted rounded-xl print:[print-color-adjust:exact] print:[-webkit-print-color-adjust:exact]"
									key={index}>
									<img
										alt={item?.product?.name}
										src={item?.product?.image?.imageURL}
										className="size-16 rounded-lg object-cover bg-background shrink-0"
									/>
									<div className="flex-1 min-w-0">
										<h4 className="font-semibold text-sm text-foreground mb-1">
											{item?.product?.name}
										</h4>
										<p className="text-xs text-muted-foreground mb-2">
											{item?.product?.weightPerUnit} kg
										</p>
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3 text-xs text-muted-foreground">
												<span>{item?.quantity}</span>
												<span>×</span>
												<span>
													{handleCurrency(item?.product?.price)}
												</span>
											</div>
											<p className="font-semibold text-foreground">
												{handleCurrency(
													item?.quantity * item?.product?.price,
												)}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="space-y-3 mb-6">
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Subtotal</span>
							<span className="text-foreground">
								{handleCurrency(order?.totalPrice)}
							</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Diskon</span>
							<span className="text-primary">Rp 0</span>
						</div>
					</div>
					<div className="flex items-center justify-between pt-3 border-t border-border">
						<span className="font-heading text-xl font-bold text-foreground">
							Total
						</span>
						<span className="font-heading text-2xl font-bold text-primary">
							{handleCurrency(order?.totalPrice)}
						</span>
					</div>
				</div>
			</div>
		</main>
	)
}

export {
    OrderInvoice
}