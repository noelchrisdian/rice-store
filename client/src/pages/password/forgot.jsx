import { CircularLoading } from "respinner";
import { emailSchema, reset } from "../../services/auth";
import { Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const ForgotPassword = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (data) => reset(data)
	})

	const onFinish = async (data) => {
		const result = await emailSchema.safeParseAsync(data);
		if (!result.success) {
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
			await mutateAsync(result.data);
			toast.success("Email berhasil dikirim");
			navigate("/forgot-password/email-sent", {
				state: { fromForgot: true }
			})
		} catch (error) {
			if (error?.response?.data?.message === `User doesn't exist`) {
				toast.error("Akun tidak ditemukan");
			} else {
				toast.error("Terjadi kesalahan di sistem");
			}
		}
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
				<h2 className="font-font-heading text-xl font-semibold text-foreground mb-3">
					Lupa Kata Sandi?
				</h2>
				<p className="text-sm text-muted-foreground leading-relaxed mb-6">
					Masukkan email Anda untuk menerima tautan atur ulang kata sandi
				</p>
				<Form
					form={form}
					layout="vertical"
					onFinish={onFinish}
					className="space-y-2">
					<Form.Item
						required={false}
						rules={[
							{ required: true, message: "Alamat email wajib diisi" }
						]}
						name={"email"}
						label={"Alamat Email"}>
						<Input placeholder="emailanda@email.com" />
					</Form.Item>
					<button
						disabled={isPending}
						className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center cursor-pointer shadow-md gap-2 transition-all mt-8 mb-4 hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-primary focus:ring-2">
						{isPending ? (
							<CircularLoading color="#FFFFFF" size={20} />
						) : (
							"Kirim Tautan"
						)}
					</button>
				</Form>
				<div className="flex items-center justify-center">
					<Link
						to={"/sign-in"}
						className="w-full rounded-xl py-3.5 border border-primary flex items-center justify-center gap-2 text-sm text-primary font-semibold focus:outline-none focus:ring-primary/50 focus:ring-1">
						Kembali
					</Link>
				</div>
			</div>
		</div>
	)
}

export {
	ForgotPassword
}