import { BackButton } from "../../../../components/back";
import { CustomerSection } from "../../../admin/orders/detail/customer";
import { createReview, reviewSchema } from "../../../../services/reviews";
import { DeliverySection } from "./delivery";
import { FileText } from "lucide-react";
import { findOrder } from "../../../../services/orders";
import { Form, Modal } from "antd";
import { handleDate } from "../../../../utils/date";
import { ItemSection } from "./item";
import {
	Link,
	useNavigate,
	useRouteLoaderData
} from "react-router-dom";
import { PaymentSection } from "./payment";
import { PendingAlert } from "./alert";
import { ReviewForm } from "./form";
import { SellerSection } from "./seller";
import { setOrderStatus } from "../../../../utils/order";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
	useMutation,
	useQuery,
	useQueryClient
} from "@tanstack/react-query";

const CustomerOrderDetail = () => {
	const initial = useRouteLoaderData("order-detail");
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();
	const [modal, setModal] = useState({
		open: false,
		data: null
	})

	const handleCloseModal = () => {
		setModal({ open: false, data: null });
		form.resetFields();
	}

	const { data: order } = useQuery({
		queryKey: ["order_detail", initial?._id],
		queryFn: () => findOrder(initial?._id),
		initialData: initial
	})

	const { isPending, mutateAsync } = useMutation({
		mutationFn: ({ data, orderID, productID }) =>
			createReview(data, orderID, productID),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["order_detail", initial?._id]
			})
			toast.success("Ulasan Anda berhasil disimpan");
			form.resetFields();
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message);
		}
	})

	const onFinish = async (data) => {
		const result = await reviewSchema.safeParseAsync(data);
		if (!result.data) {
			const fieldErrors = result.error.flatten().fieldErrors;
			form.setFields(
				Object.entries(fieldErrors).map(([name, errors]) => ({
					name,
					errors
				}))
			)

			return;
		}

		try {
			await mutateAsync({
				data,
				orderID: order?.data?._id,
				productID: modal.data?._id
			})
		} finally {
			setModal({
				open: false,
				data: null
			})
		}
	}

	const handlePayment = () => {
		try {
			window.snap.pay(order?.data?.payment?.midtransTransactionID, {
				onSuccess: () =>
					navigate(`/orders/confirmation?order_id=${order?.data?._id}`),
				onPending: () =>
					navigate(`/orders/confirmation?order_id=${order?.data?._id}`),
				onError: (result) => {
					toast.error(result?.status_message);
					setTimeout(
						() =>
							navigate(
								`/orders/confirmation?order_id=${order?.data?._id}`
							),
						3000
					)
				},
				onClose: () =>
					navigate(`/orders/confirmation?order_id=${order?.data?._id}`)
			})
		} catch (error) {
			toast.error(error?.response?.data?.message);
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [])

	return (
		<main className="bg-background font-sans text-foreground min-h-screen pt-10 pb-2">
			<BackButton type={"link"} path={"/orders"} />
			<PendingAlert handlePayment={handlePayment} order={order?.data} />
			<section className="px-4 pt-6 space-y-6 lg:max-w-3xl lg:mx-auto">
				<div className="bg-card rounded-2xl border border-border p-4 space-y-4">
					<div className="flex items-center justify-between">
						<div className="">
							<p className="text-sm text-muted-foreground">
								Status Pesanan
							</p>
							<p className="font-semibold text-foreground mt-1">
								{setOrderStatus(order?.data?.payment?.status, order?.data?.shipping?.status)}
							</p>
						</div>
						<div className="">
							<p className="text-xs text-muted-foreground tracking-wide">
								Tanggal Pesanan
							</p>
							<p className="text-sm text-foreground mt-1">
								{handleDate(order?.data?.createdAt)}
							</p>
						</div>
					</div>
				</div>
				<ItemSection order={order?.data} setModal={setModal} />
				<PaymentSection order={order?.data} />
				<CustomerSection order={order?.data} />
				{(order?.data?.shipping?.status === "shipped" || order?.data?.shipping?.status === "delivered") && (
					<DeliverySection order={order?.data} />
				)}
				<SellerSection />
				<div className="px-4 pb-6 space-y-3">
					<Link
						to={`/orders/${order?.data?._id}/invoice`}
						className="fixed bottom-6 right-6 size-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer active:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50">
						<FileText />
					</Link>
				</div>
			</section>
			<Modal
				open={modal.open}
				onCancel={handleCloseModal}
				title={null}
				centered
				footer={null}
				styles={{
					content: {
						borderRadius: "36px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<ReviewForm
					form={form}
					modal={modal}
					onFinish={onFinish}
					pending={isPending}
				/>
			</Modal>
		</main>
	)
}

export {
	CustomerOrderDetail
}