import { addInventory, inventorySchema } from "../../../services/inventories";
import { CircularLoading } from "respinner";
import {
	DatePicker,
	Form,
	Input
} from "antd";
import { toast } from "sonner";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const AddInventoryForm = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const product = useLoaderData();

	const { isPending, mutateAsync } = useMutation({
		mutationFn: ({ data, productID }) => addInventory(data, productID)
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
				productID: product._id
			})
			toast.success("Stok baru berhasil dibuat");
			navigate(`/admin/products/${product._id}`);
		} catch (error) {
			toast.error(`${error?.response?.data?.message === `Product doesn't exist` ? 'Produk tidak ditemukan' : 'Terjadi kesalahan di sistem'}`)
		}
	}

	return (
		<div className="px-5 py-24 lg:py-20">
			<Form
				form={form}
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
						<DatePicker className="w-full!" needConfirm format={"DD-MM-YYYY"} />
					</Form.Item>
					<button
						type="submit"
						disabled={isPending}
						className="w-[150px] mx-auto bg-primary text-primary-foreground px-1 py-3 rounded-xl font-semibold text-base shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
						{isPending ? (
							<CircularLoading color="#FFFFFF" size={26} />
						) : (
							"Buat Stok"
						)}
					</button>
				</div>
			</Form>
		</div>
	)
}

export {
	AddInventoryForm
}