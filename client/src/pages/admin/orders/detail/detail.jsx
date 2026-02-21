import { BackButton } from "../../../../components/back";
import { beforeUpload } from "../../../../utils/upload";
import { CustomerSection } from "./customer";
import { DeliverySection } from "./delivery";
import { FileText } from "lucide-react";
import { Form, Modal } from "antd";
import { handleDate } from "../../../../utils/date";
import { ItemSection } from "./item";
import {
	Link,
	useRevalidator,
	useRouteLoaderData
} from "react-router-dom";
import {
	orderDeliveredSchema,
	orderShippedSchema,
	updateOrderDelivered,
	updateOrderShipped,
	updateOrderShippedInfo
} from "../../../../services/orders";
import { PaymentSection } from "./payment";
import { setOrderStatus } from "../../../../utils/order";
import { StatusAlert } from "./alert";
import { StatusForm } from "./form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const AdminDetailOrder = () => {
	const order = useRouteLoaderData("admin-order-detail");
	const { revalidate } = useRevalidator();
	const [form] = Form.useForm();
	const [modal, setModal] = useState({ type: null, data: null });
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);

	const handleCloseModal = () => {
		setModal({ type: null, data: null });
		setFile(null);
		setPreview(null);
		form.resetFields();
	}

	const handleChange = ({ fileList }) => {
		const file = fileList[fileList.length - 1]?.originFileObj || null;
		setFile(file);

		if (!file) {
			setPreview(null);
			return;
		}

		const url = URL.createObjectURL(file);
		setPreview(url);
	}

	const { isPending, mutateAsync } = useMutation({
		mutationFn: ({ id, data }) => {
			switch (modal.type) {
				case "UPDATE_SHIPPED":
					return updateOrderShipped(id, data);
				case "UPDATE_SHIPPED_INFO":
					return updateOrderShippedInfo(id, data);
				case "UPDATE_DELIVERED":
					return updateOrderDelivered(id, data);
			}
		}
	})

	const onFinish = async (data) => {
		const result =
			modal.type === "UPDATE_DELIVERED"
				? await orderDeliveredSchema.safeParseAsync(data)
				: await orderShippedSchema.safeParseAsync(data);
		if (!result.success) {
			const fieldError = result.error.flatten().fieldErrors;
			form.setFields(
				Object.entries(fieldError).map(([name, errors]) => ({
					name,
					errors
				}))
			)

			return;
		}

		let payload;
		if (modal.type === "UPDATE_SHIPPED") {
			payload = new FormData();
			payload.append("courier", result.data.courier);
			payload.append("fee", result.data.fee);
			payload.append("trackingNumber", result.data.trackingNumber);
			payload.append("shippedAt", result.data.shippedAt);
			payload.append("image", file);
		} else if (modal.type === "UPDATE_SHIPPED_INFO") {
			payload = {
				courier: result.data.courier,
				fee: result.data.fee,
				trackingNumber: result.data.trackingNumber,
				shippedAt: result.data.shippedAt
			}
		} else if (modal.type === "UPDATE_DELIVERED") {
			payload = new FormData();
			payload.append("deliveredAt", result.data.deliveredAt);
			payload.append("image", file);
		}

		try {
			await mutateAsync({
				id: order._id,
				data: payload
			})
			toast.success("Status pesanan berhasil diubah");
			revalidate();
			setModal({
				type: null,
				data: null
			})
			setFile(null);
			setPreview(null);
		} catch (error) {
			toast.error(
				error?.response?.data?.message === "Image is required"
					? "Bukti foto paket wajib diunggah"
					: "Terjadi kesalahan di sistem"
			)
		}
	}

	return (
		<main className="bg-background font-sans text-foreground min-h-screen pt-10 pb-2">
			<BackButton type={"link"} path={"/admin/orders"} />
			<StatusAlert order={order} setModal={setModal} />
			<section className="px-4 pt-6 space-y-6 lg:max-w-3xl lg:mx-auto">
				<div className="bg-card rounded-2xl border border-border p-4 space-y-4">
					<div className="flex items-center justify-between">
						<div className="">
							<p className="text-sm text-muted-foreground">
								Status Pesanan
							</p>
							<p className="font-semibold text-foreground mt-1">
								{setOrderStatus(
									order?.payment?.status,
									order?.shipping?.status
								)}
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
				{order?.shipping.courier && (
					<DeliverySection order={order} setModal={setModal} />
				)}
				<div className="px-4 pb-6 space-y-3">
					<Link
						to={`/admin/orders/${order?._id}/invoice`}
						className="fixed bottom-6 right-6 size-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-10 cursor-pointer active:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50">
						<FileText className="size-6" />
					</Link>
				</div>
			</section>
			<Modal
				open={[
					"UPDATE_SHIPPED",
					"UPDATE_SHIPPED_INFO",
					"UPDATE_DELIVERED"
				].includes(modal.type)}
				onCancel={handleCloseModal}
				title={null}
				centered
				footer={null}
				styles={{
					content: {
						borderRadius: "30px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<StatusForm
					beforeUpload={beforeUpload}
					form={form}
					handleChange={handleChange}
					isPending={isPending}
					modal={modal}
					onFinish={onFinish}
					preview={preview}
				/>
			</Modal>
		</main>
	)
}

export {
	AdminDetailOrder
}