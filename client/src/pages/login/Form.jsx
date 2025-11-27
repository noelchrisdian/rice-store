import secureLocalStorage from "react-secure-storage";
import { Form, Input } from "antd";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { login, loginSchema } from "../../services/auth";
import { useMutation } from "@tanstack/react-query";

const LoginForm = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const setAlert = useOutletContext();

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

			setAlert({
				display: true,
				type: "success",
				message: `Selamat datang, ${response.data?.name}!`,
			})

			if (response.data?.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/");
			}
		} catch (error) {
			setAlert({
				display: true,
				type: "error",
				message: error?.response?.data?.message === 'Phone number is not registered' ? 'Akun tidak ditemukan' : (error?.response?.data?.message === 'Incorrect password' ? 'Kata sandi salah' : 'Terjadi kesalahan di sistem')
			})
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
						<Input
							type="password"
							placeholder="Masukkan kata sandi"
						/>
					</Form.Item>
					<div className="flex justify-end">
						<Link
							to={"#"}
							className="text-sm! text-primary! font-medium! hover:underline!">
							Lupa kata sandi?
						</Link>
					</div>
					<button
						className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl active:scale-[0.98] transition-transform shadow-primary/30 shadow-lg cursor-pointer text-md outline-none"
						disabled={isPending}>
						Masuk
					</button>
				</Form>
			</div>
			<div className="text-center flex justify-center">
				<p className="text-sm text-muted-foreground">Belum punya akun?</p>
				<Link
					to={"/sign-up"}
					className="text-sm text-primary font-medium hover:underline ml-2">
					Daftar
				</Link>
			</div>
		</div>
	)
}

export {
	LoginForm
}