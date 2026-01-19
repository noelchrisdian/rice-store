import {
    CircleAlert,
    CircleCheck,
    History
} from "lucide-react";
import { CircularLoading } from "respinner";
import { cancelOrder, findOrder } from "../../services/orders";
import {
    Link,
    useNavigate,
    useSearchParams
} from "react-router-dom";
import { Modal } from "antd";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

const CustomerCheckout = () => {
	const [searchParams] = useSearchParams();
	const [modal, setModal] = useState(false);
	const navigate = useNavigate();
	const orderID = searchParams.get("order_id");

	useEffect(() => {
		if (!orderID) {
			toast.warning("ID Pesanan tidak ditemukan");
			navigate("/");
		}
	}, [navigate, orderID]);

	const { data } = useQuery({
		queryKey: ["orderID", orderID],
		enabled: !!orderID,
		retry: false,
		queryFn: async () => {
			const result = await findOrder(orderID);
			return result.data;
		}
	})

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (id) => cancelOrder(id)
	})

	const handleCloseModal = () => {
		setModal(false);
	}

	const handlePayment = async () => {
		try {
			window.snap.pay(data?.payment?.midtransTransactionID, {
				onSuccess: () => {
					window.location.href = `/orders/confirmation?order_id=${orderID}`;
				},
				onPending: () => {
					window.location.href = `/orders/confirmation?order_id=${orderID}`;
				},
				onError: () => {
					toast.error("Pembayaran gagal");
				},
				onClose: () => {
					window.location.href = `/orders/confirmation?order_id=${orderID}`;
				}
			})
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	}

	const handleCancel = async () => {
		try {
            await mutateAsync(orderID);
            setModal(false);
			navigate(`/orders/${orderID}`);
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	}

	return (
		<main className="min-h-screen bg-background text-foreground font-sans">
			<section className="px-4 py-8 flex flex-col items-center justify-center min-h-screen">
				<div className="flex flex-col items-center">
					{(data?.payment?.status === "settlement" ||
						data?.payment?.status === "capture") && (
						<div className="flex flex-col items-center mb-12">
							<div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
								<CircleCheck className="size-14 text-primary" />
							</div>
							<h2 className="font-font-heading text-3xl font-bold text-center mb-2">
								Pembayaran Berhasil
							</h2>
							<p className="text-primary text-center text-sm">
								Pesanan Anda berhasil dikonfirmasi
							</p>
						</div>
					)}
					{data?.payment?.status === "pending" && (
						<div className="flex flex-col items-center mb-12">
							<div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
								<History className="size-14 text-primary" />
							</div>
							<h2 className="font-font-heading text-3xl font-bold text-center mb-2">
								Pembayaran Belum Selesai
							</h2>
							<p className="text-primary text-center text-sm">
								Selesaikan pembayaran sekarang
							</p>
						</div>
					)}
					<div className="w-full max-w-md space-y-3">
						{(data?.payment?.status === "settlement" ||
							data?.payment?.status === "capture") && (
							<>
								<Link
									to={`/orders/${orderID}`}
									className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98]">
									Lihat Detail Pesanan
								</Link>
								<Link
									to={"/"}
									className="w-full flex items-center justify-center bg-secondary text-secondary-foreground font-semibold py-4 rounded-xl transition-all cursor-pointer active:scale-[0.98]">
									Lanjut Belanja
								</Link>
							</>
						)}
						{data?.payment?.status === "pending" && (
							<>
								<button
									onClick={() => handlePayment()}
									className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98]">
									Bayar Sekarang
								</button>
								<button
									onClick={() => setModal(true)}
									className="w-full bg-destructive text-primary-foreground font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98]">
									Batalkan Pesanan
								</button>
							</>
						)}
					</div>
				</div>
			</section>
			<Modal
				open={modal}
				onCancel={handleCloseModal}
				title={null}
				centered
				closeIcon={null}
				footer={null}
				styles={{
					content: {
						borderRadius: "36px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<div className="bg-card p-4">
					<div className="flex flex-col items-center text-center mb-6">
						<div className="size-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
							<CircleAlert className="size-10 text-destructive" />
						</div>
						<h2 className="font-font-heading font-semibold text-xl text-foreground mb-2">
							Batalkan Pesanan?
						</h2>
						<span className="text-sm text-muted-foreground tracking-wide">
							Pesanan ini akan dibatalkan dan Anda harus memesan ulang
							nanti
						</span>
					</div>

					<div className="space-y-3">
                        <button
                            disabled={isPending}
							className="w-full h-14 bg-destructive text-primary-foreground rounded-2xl font-bold text-base transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
							onClick={() => handleCancel()}>
							{isPending ? (
								<CircularLoading size={30} color="#FFFFFF" />
							) : (
								<span>Ya, batalkan</span>
							)}
						</button>
						<button
							className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-semibold text-base transition-transform flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
							onClick={() => handleCloseModal()}>
							<span>Kembali</span>
						</button>
					</div>
				</div>
			</Modal>
		</main>
	)
}

export {
    CustomerCheckout
}