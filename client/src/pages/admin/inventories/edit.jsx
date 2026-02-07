import dayjs from "dayjs";
import { CircularLoading } from "respinner";
import {
	DatePicker,
	Form,
	Input
} from "antd";
import { toast } from "sonner";
import { updateInventory, inventorySchema } from "../../../services/inventories";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EditInventoryForm = () => {
	const { inventory, product } = useLoaderData();
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const initialValues = {
		quantity: inventory?.quantity ?? 0,
		receivedAt: inventory.receivedAt ? dayjs(inventory.receivedAt) : null
	}

	const { isPending, mutateAsync } = useMutation({
		mutationFn: ({ data, id, productID }) =>
			updateInventory(data, id, productID),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventories', product._id] })
	})

	const onFinish = async (data) => {
		const value = {
			quantity: data.quantity,
			receivedAt: data.receivedAt ? data.receivedAt.toISOString() : null
		}

		const result = await inventorySchema.safeParseAsync(value);
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

		try {
			await mutateAsync({
				data: result.data,
				id: inventory._id,
				productID: product._id
			})
			toast.success("Stok berhasil diubah");
			navigate(`/admin/products/${product._id}`);
		} catch (error) {
			switch (error?.response?.data?.message) {
				case `Product doesn't exist`:
					toast.error("Produk tidak ditemukan");
					break;
				case `Inventory doesn't exist`:
					toast.error("Stok tidak ditemukan");
					break;
				case `Remaining stock couldn't be negative number`:
					toast.error("Stok sisa harus bernilai positif");
					break;
				default:
					toast.error("Terjadi kesalahan di sistem");
					break;
			}
		}
	}

	return (
		<div className="px-5 py-24 lg:py-20">
			<Form
				form={form}
				initialValues={initialValues}
				layout="vertical"
				onFinish={onFinish}
				className="space-y-10">
				<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 lg:max-w-3xl lg:mx-auto">
					<Form.Item
						name={"quantity"}
						label={"Kuantitas"}
						required={false}
						rules={[
							{ required: true, message: "Kuantitas stok wajib diisi" }
						]}>
						<Input
							className="w-full!"
							placeholder="25"
							type="number"
							suffix={"kg"}
						/>
					</Form.Item>
					<Form.Item
						name={"receivedAt"}
						label={"Tanggal Diterima"}
						required={false}
						rules={[
							{
								required: true,
								message: "Tanggal diterima wajib diisi"
							}
						]}>
						<DatePicker
							className="w-full!"
							needConfirm
							format={"DD-MM-YYYY"}
						/>
					</Form.Item>
					<button
						type="submit"
						disabled={isPending}
						className="w-37.5 mx-auto bg-primary text-primary-foreground px-1 py-3 rounded-xl font-semibold text-base shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
						{isPending ? (
							<CircularLoading color="#FFFFFF" size={26} />
						) : (
							"Ubah Stok"
						)}
					</button>
				</div>
			</Form>
		</div>
	)
}

export {
	EditInventoryForm
}