import { CircularLoading } from "respinner";
import {
    Form,
    Image,
    Input,
    Upload
} from "antd";

const UserForm = ({
	beforeUpload,
	form,
	handleChange,
	initialValues,
	isPending,
	onFinish,
	preview
}) => {
	return (
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
					rules={[{ required: true, message: "Nama wajib diisi" }]}>
					<Input type="text" placeholder="Masukkan nama Anda" />
				</Form.Item>
				<div className="lg:grid lg:grid-cols-2 lg:gap-4">
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
						rules={[
							{
								required: true,
								message: "Alamat email wajib diisi"
							}
						]}>
						<Input
							className="w-full!"
							placeholder="emailanda@gmail.com"
							type="email"
						/>
					</Form.Item>
				</div>
				<div className="lg:grid lg:grid-cols-2 lg:gap-4">
					<Form.Item label={"Kata sandi"} name={"password"}>
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
	)
}

export {
    UserForm
}