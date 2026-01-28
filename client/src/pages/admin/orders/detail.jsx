import {
	ArrowLeft,
	Calendar,
	ClipboardCheck,
	ClipboardClock,
	ClipboardX,
	Contact,
	CreditCard,
	FileDown,
	MapPin,
	Store
} from "lucide-react";
import { CircularLoading } from "respinner";
import { createAdminInvoice } from "../../../services/orders";
import { handleDate } from "../../../utils/date";
import { handleCurrency } from "../../../utils/price";
import { Image } from "antd";
import { Link, useLoaderData } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const AdminDetailOrder = () => {
	const order = useLoaderData();

	const setPaymentStatus = (data) => {
		if (["settlement", "capture"].includes(data)) {
			return "Berhasil";
		} else if (["deny", "cancel", "expire", "failure"].includes(data)) {
			return "Gagal";
		} else if (data === "pending") {
			return "Pending";
		}
	}

	const { isPending, mutate } = useMutation({
		mutationFn: (id) => createAdminInvoice(id),
		onSuccess: async (blob) => {
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `Invoice #${order?._id}.pdf`);
			document.body.appendChild(link);
			link.click();

			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		},
		onError: (error) => {
			toast.error(error);
		}
	})

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
								{setPaymentStatus(order?.payment?.status)}
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
				<div className="bg-card rounded-2xl border border-border p-4">
					<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
						Item Pesanan
					</h2>
					<div className="space-y-4">
						{order?.products.map((product, index) => (
							<div
								className="flex items-center gap-3 pb-4 border-b border-border"
								key={index}>
								<Image
									src={product?.product?.image?.imageURL}
									height={85}
									width={85}
									className="rounded-xl! object-cover! bg-muted! border! border-border/50!"
								/>
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-sm text-foreground">
										{product?.product?.name}
									</p>
									<div className="text-xs text-muted-foreground mt-1">
										{product?.quantity} x{" "}
										{handleCurrency(product?.product?.price)}
									</div>
									<p className="font-semibold text-foreground mt-2">
										{handleCurrency(
											product?.product?.price * product?.quantity
										)}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
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
							<span className="text-foreground">
								{handleCurrency(0)}
							</span>
						</div>
						<div className="flex items-center justify-between pt-3 border-t border-border">
							<span className="font-semibold text-foreground">
								Total
							</span>
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
							{setPaymentStatus(order?.payment?.status) ===
							"Berhasil" ? (
								<ClipboardCheck className="size-7 text-primary mt-0.5 shrink-0" />
							) : setPaymentStatus(order?.payment?.status) ===
							  "Pending" ? (
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
									{handleDate(order?.payment?.paidAt)}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-card rounded-2xl border border-border p-4">
					<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
						Alamat Pengiriman
					</h2>
					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<Contact className="size-7 text-primary mt-0.5 shrink-0" />
							<div className="flex-1 mb-2">
								<p className="text-sm text-foreground mb-1">
									{order?.user?.name}
								</p>
								<p className="text-sm text-foreground mb-1">
									{order?.user?.email}
								</p>
								<p className="text-sm text-foreground">
									{order?.user?.phoneNumber}
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<MapPin className="size-7 text-primary mt-0.5 shrink-0" />
							<div className="flex-1">
								<p className="text-sm text-foreground mb-2 lg:mt-1.5">
									{order?.user?.address}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="bg-card rounded-2xl border border-border p-4">
					<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
						Informasi Penjual
					</h2>
					<div className="flex items-start gap-3">
						<Store className="size-7 text-primary mt-0.5 shrink-0" />
						<div className="flex-1">
							<p className="text-sm text-foreground font-semibold mb-1">
								Toko Beras AD
							</p>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Jalan Kedung Ombo A46
								<br />
								Lembah Hijau, Magelang 56172
								<br />
								Jawa Tengah, Indonesia
							</p>
						</div>
					</div>
				</div>
				<div className="px-4 pb-6 space-y-3">
					<button disabled={isPending} onClick={() => mutate(order?._id)} className="fixed bottom-6 right-6 size-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer active:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50">
						{isPending ? (
							<CircularLoading color="#FFFFFF" size={30} />
						) : (
							<FileDown className="size-6" />
						)}
					</button>
				</div>
			</section>
		</main>
	)
}

export {
	AdminDetailOrder
}