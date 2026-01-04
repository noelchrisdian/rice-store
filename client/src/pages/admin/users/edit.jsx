import { ArrowLeft } from "lucide-react";
import { changeProfileSchema, updateUser } from "../../../services/users";
import { CircularLoading } from "respinner";
import {
	Form,
	Image,
	Input,
	Upload
} from "antd";
import { toast } from "sonner";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const EditUserForm = () => {
	const navigate = useNavigate();
	const user = useLoaderData();
	const [form] = Form.useForm();
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(user?.avatar?.imageURL);
	const initialValues = { ...user };
	delete initialValues.password;

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
			setPreview(user?.avatar?.imageURL);
			return;
		}

		const url = URL.createObjectURL(file);
		setPreview(url);
	}

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (data) => updateUser(data)
	})

	const onFinish = async (data) => {
		const result = await changeProfileSchema.safeParseAsync(data);
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
		formData.append('phoneNumber', result.data.phoneNumber);
		formData.append('email', result.data.email);
		formData.append('address', result.data.address);

		if (result.data.password && result.data.confirmPassword) {
			formData.append('password', result.data.password);
			formData.append('confirmPassword', result.data.confirmPassword);
		} else {
			formData.append('password', user.password);
			formData.append('confirmPassword', user.password);
		}

		if (file) {
			formData.append("image", file);
		}

		try {
			await mutateAsync(formData)
			toast.success("Data Anda berhasil diubah");
			navigate(user.role === 'admin' ? "/admin/settings" : '/account');
		} catch (error) {
			switch (error?.response?.data?.message) {
				case `User doesn't exist`:
					toast.error('Pengguna belum terdaftar');
					break;
				case `Email already in use`:
					toast.error('Alamat email sudah digunakan');
					break;
				case `Phone number already in use`:
					toast.error('Nomor handphone sudah digunakan');
					break;
				default:
					toast.error('Terjadi kesalahan di sistem');
					break;
			}
		}
	}

	return (
		<>
			{user.role === 'customer' && (
				<button className="fixed top-4 left-4 z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:top-6 lg:left-5" onClick={() => navigate('/')}>
                <ArrowLeft className="size-6 cursor-pointer" />
            </button>
			)}
			<div className="px-5 py-20 lg:py-20">
				<Form
					form={form}
					initialValues={initialValues}
					layout="vertical"
					onFinish={onFinish}
					className="space-y-10">
					<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 lg:max-w-3xl lg:mx-auto">
						<div className="flex gap-3">
							<Image
								src={preview}
								width={100}
								className="rounded-full! bg-muted! border! border-border/60! w-25! h-25.75! object-cover!"
							/>
							<Form.Item>
								<Upload
									beforeUpload={beforeUpload}
									listType="picture-circle"
									showUploadList={false}
									onChange={handleChange}>
									Unggah <br /> Foto Profil
								</Upload>
							</Form.Item>
						</div>
						<Form.Item
							label={"Nama"}
							name={"name"}
							required={false}
							rules={[
								{ required: true, message: "Nama wajib diisi" }
							]}>
							<Input type="text" placeholder="Masukkan nama Anda" />
						</Form.Item>
						<div className="lg:grid lg:grid-cols-2 lg:gap-4">
							<Form.Item
								label={"Nomor Handphone"}
								name={"phoneNumber"}
								required={false}
								rules={[{ required: true, message: "Nomor handphone wajib diisi" }]}>
								<Input
									className="w-full!"
									placeholder="+628123456789"
									type="text"
								/>
							</Form.Item>
							<Form.Item
								label={"Email"}
								name={"email"}
								required={false}
								rules={[{ required: true, message: "Alamat email wajib diisi" }]}>
								<Input
									className="w-full!"
									placeholder="emailanda@gmail.com"
									type="email"
								/>
							</Form.Item>
						</div>
						<div className="lg:grid lg:grid-cols-2 lg:gap-4">
							<Form.Item
								label={"Kata sandi"}
								name={"password"}>
								<Input
									className="w-full!"
									placeholder="Masukkan kata sandi Anda"
									type="password"
								/>
							</Form.Item>
							<Form.Item
								label={"Konfirmasi Kata sandi"}
								name={"confirmPassword"}>
								<Input
									className="w-full!"
									placeholder="Masukkan kata sandi Anda"
									type="password"
								/>
							</Form.Item>
						</div>
						<Form.Item
							label={"Alamat"}
							name={"address"}
							required={false}
							rules={[{ required: true, message: "Alamat wajib diisi" }]}>
							<Input.TextArea
								className="w-full!"
								placeholder="Jalan Mrica 3 T26, Lembah Hijau"
								type="text"
							/>
						</Form.Item>
						<button
							type="submit"
							disabled={isPending}
							className="w-62.5 mx-auto bg-primary text-primary-foreground p-4 rounded-xl font-semibold text-base shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
							{isPending ? (
								<CircularLoading size={26} color="#FFFFFF" />
							) : (
								"Ubah Profil"
							)}
						</button>
					</div>
				</Form>
			</div>
		</>
	)
}

export {
    EditUserForm
}