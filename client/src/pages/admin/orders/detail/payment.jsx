import {
    Calendar,
    CreditCard,
    ClipboardCheck,
    ClipboardClock,
    ClipboardX
} from "lucide-react";
import { handleCurrency } from "../../../../utils/price";
import { handleDatetime } from "../../../../utils/date";
import { setPaymentStatus } from "../../../../utils/order";

const PaymentSection = ({ order }) => {
	return (
		<>
			<div className="bg-card rounded-2xl border border-border p-4">
				<h2 className="font-heading text-lg font-bold text-foreground mb-4">
					Rincian Pembayaran
				</h2>
				<div className="space-y-3">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Subtotal</span>
						<span className="text-foreground">
							{handleCurrency(order?.totalPrice)}
						</span>
					</div>
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Diskon</span>
						<span className="text-foreground">{handleCurrency(0)}</span>
					</div>
					<div className="flex items-center justify-between pt-3 border-t border-border">
						<span className="font-semibold text-foreground">Total</span>
						<span className="text-foreground">
							{handleCurrency(order?.totalPrice)}
						</span>
					</div>
				</div>
			</div>
			<div className="bg-card rounded-2xl border border-border p-4">
				<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
					Informasi Pembayaran
				</h2>
				<div className="space-y-3">
					<div className="flex items-start gap-3">
						<CreditCard className="size-7 text-primary mt-0.5 shrink-0" />
						<div className="flex-1">
							<p className="text-xs text-muted-foreground tracking-wide mb-1">
								Metode Pembayaran
							</p>
							<p className="text-sm text-foreground">Midtrans</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						{setPaymentStatus(order?.payment?.status) === "Lunas" ? (
							<ClipboardCheck className="size-7 text-primary mt-0.5 shrink-0" />
						) : setPaymentStatus(order?.payment?.status) === "Pending" ? (
							<ClipboardClock className="size-7 text-primary mt-0.5 shrink-0" />
						) : (
							<ClipboardX className="size-7 text-destructive mt-0.5 shrink-0" />
						)}
						<div className="flex-1">
							<p className="text-xs text-muted-foreground tracking-wide mb-1">
								Status Pembayaran
							</p>
							<p className="text-sm text-foreground">
								{setPaymentStatus(order?.payment?.status)}
							</p>
						</div>
					</div>
					<div className="flex items-start gap-3">
						<Calendar className="size-7 text-primary mt-0.5 shrink-0" />
						<div className="flex-1">
							<p className="text-xs text-muted-foreground tracking-wide mb-1">
								Tanggal Pembayaran
							</p>
							<p className="text-sm text-foreground">
								{handleDatetime(order?.payment?.paidAt)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export {
    PaymentSection
}