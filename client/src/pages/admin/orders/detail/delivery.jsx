import dayjs from "dayjs";
import {
    CalendarCheck2,
    CalendarDays,
    Check,
    Copy,
    Hash,
    Package,
    Pencil,
    Truck
} from "lucide-react";
import { handleCurrency } from "../../../../utils/price";
import { handleDatetime } from "../../../../utils/date";
import { Image, Typography } from "antd";

const DeliverySection = ({ order, setModal }) => {
	return (
		<div className="bg-card rounded-2xl border border-border p-4">
			<div className="flex items-center justify-between">
				<h2 className="font-heading text-lg font-bold text-foreground mb-4">
					Informasi Pengiriman
				</h2>
				{order?.shipping?.status === "shipped" && (
					<button
						className="flex items-center justify-center size-8 rounded-lg cursor-pointer bg-muted focus:outline-none focus:ring-2 focus:ring-primary active:opacity-70"
						onClick={() =>
							setModal({
								type: "UPDATE_SHIPPED_INFO",
								data: {
									...order?.shipping,
									shippedAt: order?.shipping?.shippedAt
										? dayjs(order?.shipping?.shippedAt)
										: null
								}
							})
						}>
						<Pencil className="size-4 text-muted-foreground" />
					</button>
				)}
			</div>
			<div className="space-y-4">
				<div className="flex items-start gap-3">
					<Package className="size-7 text-primary mt-0.5 shrink-0" />
					<div className="flex-1">
						<p className="text-xs text-muted-foreground tracking-wide mb-1">
							Ekspedisi
						</p>
						<p className="text-sm text-foreground">
							{order?.shipping?.courier}
						</p>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<Hash className="size-7 text-primary mt-0.5 shrink-0" />
					<div className="flex-1">
						<p className="text-xs text-muted-foreground tracking-wide mb-1">
							Nomor Resi
						</p>
						<div className="flex items-center gap-2">
							<Typography.Text
								style={{
									color: "inherit",
									fontFamily: "inherit",
									display: "inline-flex",
									alignItems: "center",
									gap: "4px"
								}}
								className="text-sm! font-sans! text-foreground!"
								copyable={{
									icon: [
										<Copy className="size-4 text-green-700" />,
										<Check className="size-4 text-green-500" />
									]
								}}>
								{order?.shipping?.trackingNumber}
							</Typography.Text>
						</div>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<Truck className="size-7 text-primary mt-0.5 shrink-0" />
					<div className="flex-1">
						<p className="text-xs text-muted-foreground tracking-wide mb-1">
							Biaya Pengiriman
						</p>
						<p className="text-sm text-foreground">
							{handleCurrency(order?.shipping?.fee || 0)}
						</p>
						<p className="text-[9px] text-muted-foreground">
							(Biaya pengiriman belum termasuk ke dalam total pembayaran
							dan harus dibayar langsung ke kurir)
						</p>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<CalendarDays className="size-7 text-primary mt-0.5 shrink-0" />
					<div className="flex-1">
						<p className="text-xs text-muted-foreground tracking-wide mb-1">
							Tanggal Pengiriman
						</p>
						<p className="text-sm text-foreground">
							{handleDatetime(order?.shipping?.shippedAt)}
						</p>
					</div>
				</div>
				<div className="flex items-start gap-3">
					<CalendarCheck2 className="size-7 text-primary mt-0.5 shrink-0" />
					<div className="flex-1">
						<p className="text-xs text-muted-foreground tracking-wide mb-1">
							Tanggal Diterima
						</p>
						<p className="text-sm text-foreground">
							{order?.shipping?.deliveredAt === undefined
								? "Belum diterima"
								: handleDatetime(order?.shipping?.deliveredAt)}
						</p>
					</div>
				</div>
				<div className="pt-3 border-t border-border">
					<p className="text-xs font-semibold text-muted-foreground tracking-wide mb-3">
						{order?.shipping?.status === "delivered"
							? "Bukti Diterima"
							: "Bukti Pengiriman"}
					</p>
					<Image
						src={order?.shipping?.proofImage?.imageURL}
						width={200}
						className="w-full! rounded-lg! border! border-border! object-cover!"
					/>
				</div>
			</div>
		</div>
	)
}

export {
    DeliverySection
}