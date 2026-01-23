import {
    changePassword,
    findToken,
    passwordSchema
} from "../../services/auth";
import { Form, Input } from "antd";
import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CircularLoading } from "respinner";

const ChangePassword = () => {
	const [form] = Form.useForm();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
    const token = searchParams.get("token");
    
    useEffect(() => {
        if (!token) {
            navigate('/sign-in', { replace: true });
        }
    }, [token, navigate])

	const { data, isLoading, isSuccess } = useQuery({
		queryKey: ["checkToken", token],
		queryFn: () => findToken(token),
		enabled: !!token
	})

	useEffect(() => {
		if (isSuccess && !data.data) {
			navigate("/sign-in", { replace: true });
		}
    }, [data, isSuccess, navigate])
    
    const { isPending, mutateAsync } = useMutation({
        mutationFn: ({ data, token }) => changePassword(data, token)
    })

	const onFinish = async (data) => {
        const result = await passwordSchema.safeParseAsync(data);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            form.setFields(
                Object.entries(fieldErrors).map(([name, errors]) => ({ name, errors }))
            )

            return;
        }

        try {
            await mutateAsync({
                data: {
                    password: result.data.password,
                    confirmPassword: result.data.confirmPassword
                },
                token
            })
            toast.success('Kata sandi Anda berhasil diubah');
            navigate('/sign-in');
        } catch (error) {
            switch (error?.response?.data?.message) {
                case 'Invalid / expired token':
                    toast.error('Token invalid');
                    break;
                case `Passwords don't match`:
                    toast.error('Kata sandi wajib sama');
                    break;
                case 'User not found':
                    toast.error('Akun tidak ditemukan');
                    break;
                default:
                    toast.error('Terjadi kesalahan di sistem');
                    break;
            }
        }
	}

	return (
		<>
			{!isLoading && (
				<main className="w-full max-w-md mx-auto">
					<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
						<div className="mb-6">
							<h2 className="font-font-heading text-xl font-semibold text-foreground mb-3">
								Atur Ulang Kata Sandi
							</h2>
							<p className="text-sm text-muted-foreground leading-relaxed">
								Pilih kata sandi yang belum pernah Anda gunakan
								sebelumnya
							</p>
						</div>
						<Form
							form={form}
							layout="vertical"
							onFinish={onFinish}
							className="space-y-6">
							<Form.Item
								name={"password"}
								label={"Kata Sandi"}
								required={false}
								rules={[
									{ required: true, message: "Kata sandi wajib diisi" }
								]}>
								<Input.Password placeholder="Masukkan kata sandi" />
							</Form.Item>
							<Form.Item
								name={"confirmPassword"}
								label={"Konfirmasi Kata Sandi"}
								required={false}
								rules={[
									{ required: true, message: "Kata sandi wajib diisi" }
								]}>
								<Input.Password placeholder="Masukkan kata sandi" />
							</Form.Item>
                            <button disabled={isPending} className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-sm flex items-center justify-center cursor-pointer shadow-md gap-2 transition-all mt-8 mb-4 hover:opacity-90 hover:shadow-lg focus:outline-none focus:ring-primary focus:ring-2">
                                {isPending ? <CircularLoading color="#FFFFFF" size={20} /> : 'Ubah Kata Sandi'}
							</button>
						</Form>
					</div>
				</main>
			)}
		</>
	)
}

export {
    ChangePassword
}