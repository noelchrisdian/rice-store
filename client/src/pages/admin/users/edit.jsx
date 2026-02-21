import { BackButton } from "../../../components/back";
import { beforeUpload } from "../../../utils/upload";
import { changeProfileSchema, updateUser } from "../../../services/users";
import { Form } from "antd";
import { toast } from "sonner";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserForm } from "./form";
import { useState } from "react";

const EditUserForm = () => {
	const navigate = useNavigate();
	const user = useLoaderData();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(user?.avatar?.imageURL);
	const initialValues = { ...user };
	delete initialValues.password;

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
		mutationFn: (data) => updateUser(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["user-detail"] });
			await queryClient.invalidateQueries({
				queryKey: ["users"],
				exact: false
			})
		}
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
		formData.append("phoneNumber", result.data.phoneNumber);
		formData.append("email", result.data.email);
		formData.append("address", result.data.address);

		if (result.data.password && result.data.confirmPassword) {
			formData.append("password", result.data.password);
			formData.append("confirmPassword", result.data.confirmPassword);
		} else {
			formData.append("password", user.password);
			formData.append("confirmPassword", user.password);
		}

		if (file) {
			formData.append("image", file);
		}

		try {
			await mutateAsync(formData);
			toast.success("Data Anda berhasil diubah");
			navigate(user.role === "admin" ? "/admin" : "/");
		} catch (error) {
			switch (error?.response?.data?.message) {
				case `User doesn't exist`:
					toast.error("Pengguna belum terdaftar");
					break;
				case `Email already in use`:
					toast.error("Alamat email sudah digunakan");
					break;
				case `Phone number already in use`:
					toast.error("Nomor handphone sudah digunakan");
					break;
				default:
					toast.error("Terjadi kesalahan di sistem");
					break;
			}
		}
	}

	return (
		<>
			{user.role === "customer" && (
				<BackButton type={"button"} path={"/"} />
			)}
			<div className="px-5 py-20 lg:py-20">
				<UserForm
					beforeUpload={beforeUpload}
					form={form}
					handleChange={handleChange}
					initialValues={initialValues}
					isPending={isPending}
					onFinish={onFinish}
					preview={preview}
				/>
			</div>
		</>
	)
}

export {
	EditUserForm
}