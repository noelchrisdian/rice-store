import secureLocalStorage from "react-secure-storage";
import { Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { login, loginSchema } from "../../services/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const LoginForm = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (data) => login(data)
	})

	const onFinish = async (data) => {
		const value = {
			phoneNumber: `+62${data.phoneNumber}`,
			password: data.password
		}

		const result = await loginSchema.safeParseAsync(value);
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
			const response = await mutateAsync(result.data);
			secureLocalStorage.setItem("SESSION_KEY", response.data);
			toast.success(`Halo, ${response.data?.name}`);
			if (response.data?.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/");
			}
		} catch (error) {
			switch (error?.response?.data?.message) {
				case 'Phone number is not registered':
					toast.error('Akun tidak ditemukan');
					break;
				case 'Incorrect password':
					toast.error('Kata sandi salah');
					break;
				default:
					toast.error('Terjadi kesalahan di sistem');
					break;
			}
		}
	}

	return (
		<div>
			<div className="bg-card border border-border/50 shadow-sm p-6 mb-6 rounded-2xl">
				<Form
					form={form}
					layout="vertical"
					onFinish={onFinish}
					className="space-y-4">
					<Form.Item
						label={"Nomor Handphone"}
						name={"phoneNumber"}
						required={false}
						rules={[
							{ required: true, message: "Nomor handphone wajib diisi" }
						]}>
						<Input type="text" placeholder="8123456789" prefix={"+62"} />
					</Form.Item>
					<Form.Item
						label={"Kata Sandi"}
						name={"password"}
						required={false}
						rules={[
							{ required: true, message: "Kata sandi wajib diisi" }
						]}>
						<Input type="password" placeholder="Masukkan kata sandi" />
					</Form.Item>
					<div className="flex justify-end">
						<Link
							to={"#"}
							className="text-sm! text-primary! font-medium! hover:underline! focus:underline! focus:outline-none!">
							Lupa kata sandi?
						</Link>
					</div>
					<button
						className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl transition-transform shadow-primary/30 shadow-lg cursor-pointer text-md active:scale-[0.98] focus:ring-2 focus:outline-none focus:ring-primary/50"
						disabled={isPending}>
						Masuk
					</button>
				</Form>
			</div>
			<div className="text-center flex justify-center">
				<p className="text-sm text-muted-foreground">Belum punya akun?</p>
				<Link
					to={"/sign-up"}
					className="text-sm text-primary font-medium ml-2 hover:underline focus:outline-none focus:underline">
					Daftar
				</Link>
			</div>
		</div>
	)
}

export {
	LoginForm
}