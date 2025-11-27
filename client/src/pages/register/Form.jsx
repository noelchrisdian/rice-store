import { Form, Input, Upload } from "antd";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { register, registerSchema } from "../../services/auth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const RegisterForm = () => {
	const [form] = Form.useForm();
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const setAlert  = useOutletContext();

	const beforeUpload = (file) => {
		const typesAllowed = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/webp"
		]
		const fileType = typesAllowed.includes(file.type);
		if (!fileType) {
			setAlert({
				display: true,
				type: "error",
				message: "File tidak valid",
			})
		}

		const fileSize = file.size / 1024 / 1024 < 4;
		if (!fileSize) {
			setAlert({
				display: true,
				type: "error",
				message: "Ukuran file <4MB",
			})
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
    
    const navigate = useNavigate();

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (data) => register(data)
	})

	const onFinish = async (data) => {
		const value = {
			...data,
			phoneNumber: `+62${data.phoneNumber}`
        }

		const result = await registerSchema.safeParseAsync(value);
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
		formData.append("phoneNumber", result.data.phoneNumber);
		formData.append("email", result.data.email);
		formData.append("password", result.data.password);
		formData.append("confirmPassword", result.data.confirmPassword);
		formData.append("address", result.data.address);
		if (file) {
			formData.append("image", file);
        }
        
		try {
			await mutateAsync(formData);
			setAlert({
				display: true,
				type: "success",
				message: "Akun Anda berhasil dibuat",
			})
            navigate('/sign-in');
		} catch (error) {
			setAlert({
				display: true,
				type: "error",
				message: error?.response?.data?.message === 'Phone number existed' ? 'Akun sudah terdaftar' : (error?.response?.data?.message === `Passwords don't match` ? 'Kata sandi harus sama' : 'Terjadi kesalahan di sistem')
			})
		}
	}

	return (
		<div className="">
			<div className="bg-card border border-border/50 shadow-sm p-6 mb-6 rounded-2xl">
				<Form
					form={form}
					layout="vertical"
					onFinish={onFinish}
					className="space-y-1">
					<Form.Item>
						<Upload
							beforeUpload={beforeUpload}
							listType="picture-circle"
							showUploadList={false}
							onChange={handleChange}>
							{preview ? (
								<img
									src={preview}
									alt=""
									className="w-full! h-full! object-cover! rounded-full!"
								/>
							) : (
								<div className="text-sm!">
									Unggah <br />
									Foto Profil
								</div>
							)}
						</Upload>
					</Form.Item>
					<Form.Item
						label={"Nama"}
						name={"name"}
						required={false}
						rules={[
							{
								required: true,
								message: "Nama wajib diisi"
							}
						]}>
						<Input type="text" placeholder="Masukkan nama Anda" />
					</Form.Item>
					<div className="grid lg:grid-cols-2 lg:gap-4">
						<Form.Item
							label={"Nomor Handphone"}
							name={"phoneNumber"}
							required={false}
							rules={[
								{
									required: true,
									message: "Nomor handphone wajib diisi"
								}
							]}>
							<Input type="text" placeholder="8123456789" prefix={"+62"} />
						</Form.Item>
						<Form.Item
							label={"Email"}
							name={"email"}
							required={false}
							rules={[
								{ required: true, message: "Alamat email wajib diisi" }
							]}>
							<Input type="email" placeholder="emailanda@gmail.com" />
						</Form.Item>
					</div>
					<div className="grid lg:grid-cols-2 lg:gap-4">
						<Form.Item
							label={"Kata Sandi"}
							name={"password"}
							required={false}
							rules={[
								{ required: true, message: "Kata sandi wajib diisi" }
							]}>
							<Input
								type="password"
								placeholder="Masukkan kata sandi"
							/>
						</Form.Item>
						<Form.Item
							label={"Konfirmasi Kata Sandi"}
							name={"confirmPassword"}
							required={false}
							rules={[
								{
									required: true,
									message: "Konfirmasi kata sandi wajib diisi"
								}
							]}>
							<Input
								type="password"
								placeholder="Masukkan kata sandi"
							/>
						</Form.Item>
					</div>
					<Form.Item
						label={"Alamat"}
						name={"address"}
						required={false}
						rules={[
							{
								required: true,
								message: "Alamat wajib diisi"
							}
						]}>
						<Input.TextArea placeholder="Jalan Mrica 3 T26, Lembah Hijau" />
					</Form.Item>
					<button
						className="w-full bg-primary text-primary-foreground font-bold py-3.5 mt-2.5 rounded-xl active:scale-[0.98] transition-transform shadow-primary/30 shadow-lg cursor-pointer text-md outline-none"
						disabled={isPending}>
						Daftar
					</button>
				</Form>
			</div>
			<div className="text-center flex justify-center">
				<p className="text-sm text-muted-foreground">Sudah punya akun?</p>
				<Link
					to={"/sign-in"}
					className="text-sm text-primary font-medium hover:underline ml-2">
					Masuk
				</Link>
			</div>
		</div>
	)
}

export {
    RegisterForm
}