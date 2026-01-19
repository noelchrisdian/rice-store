import { addProduct, productSchema } from "../../../services/products";
import { CircularLoading } from "respinner";
import {
	Form,
	Image,
	Input,
	Upload
} from "antd";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const AddProductForm = () => {
	const [form] = Form.useForm();
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const navigate = useNavigate();

	const beforeUpload = (file) => {
		const typesAllowed = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/webp"
		]
		const fileType = typesAllowed.includes(file.type);
		if (!fileType) {
			toast.error("File tidak valid");
		}

		const fileSize = file.size / 1024 / 1024 <= 4;
		if (!fileSize) {
			toast.error("Ukuran file maksimal 4 MB");
		}

		if (!fileType || !fileSize) {
			return Upload.LIST_IGNORE;
		}

		return false;
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
		mutationFn: (data) => addProduct(data)
	})

	const onFinish = async (data) => {
		const result = await productSchema.safeParseAsync(data);
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

		const formData = new FormData();
		formData.append("name", result.data.name);
		formData.append("price", result.data.price);
		formData.append("image", file);
		formData.append("description", result.data.description);
		formData.append("weightPerUnit", result.data.weightPerUnit);

		try {
			await mutateAsync(formData);
			toast.success("Produk berhasil ditambahkan");
			navigate("/admin/products");
		} catch (error) {
			toast.error(
				`${
					error?.response?.data?.message === "Product existed"
						? "Produk sudah terdaftar"
						: error?.response?.data?.message === "Image is required"
						? "Gambar produk wajib diunggah"
						: "Terjadi kesalahan di sistem"
				}`
			)
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
						required={false}
						rules={[
							{
								required: true,
								message: "Gambar produk wajib diunggah"
							}
						]}>
						<Upload
							beforeUpload={beforeUpload}
							listType="picture-card"
							showUploadList={false}
							onChange={handleChange}>
							{preview ? (
								<Image
									width={98}
									height={98}
									src={preview}
									preview={false}
									className="w-full! object-cover! rounded-sm!"
								/>
							) : (
								<div className="">Unggah Gambar</div>
							)}
						</Upload>
					</Form.Item>
					<Form.Item
						label={"Nama Produk"}
						name={"name"}
						required={false}
						rules={[
							{ required: true, message: "Nama produk wajib diisi" }
						]}>
						<Input type="text" placeholder="Masukkan nama produk" />
					</Form.Item>
					<Form.Item
						label={"Harga"}
						name={"price"}
						required={false}
						rules={[{ required: true, message: "Harga wajib diisi" }]}>
						<Input
							className="w-full!"
							placeholder="50000"
							prefix={"Rp"}
							type="number"
						/>
					</Form.Item>
					<Form.Item
						label={"Berat per Kemasan"}
						name={"weightPerUnit"}
						required={false}
						rules={[
							{
								required: true,
								message: "Berat per kemasan wajib diisi"
							}
						]}>
						<Input
							className="w-full!"
							placeholder="5"
							type="number"
							suffix={"kg"}
						/>
					</Form.Item>
					<Form.Item
						label={"Deskripsi"}
						name={"description"}
						required={false}>
						<Input.TextArea
							className="w-full!"
							placeholder="Masukkan deskripsi produk"
						/>
					</Form.Item>
					<button
						type="submit"
						disabled={isPending}
						className="w-62.5 mx-auto bg-primary text-primary-foreground p-4 rounded-xl font-semibold text-base shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
						{isPending ? (
							<CircularLoading color="#FFFFFF" size={26} />
						) : (
							"Buat Produk"
						)}
					</button>
				</div>
			</Form>
		</div>
	)
}

export {
	AddProductForm
}