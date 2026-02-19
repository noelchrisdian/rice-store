import { CircularLoading } from "respinner";
import {
    DatePicker,
    Form,
	Image,
	Input,
    Upload
} from "antd";

const StatusForm = ({
	beforeUpload,
	form,
	handleChange,
	isPending,
	modal,
	onFinish,
	preview
}) => {
	return (
		<div className="bg-card">
			<div className="space-y-6 p-2 max-h-[80vh] overflow-y-auto">
				<h1 className="font-semibold text-2xl border-border border-b pb-2">
					{modal.type === "UPDATE_SHIPPED_INFO"
						? "Ubah Info Pengiriman"
						: "Ubah Status Pesanan"}
				</h1>
				<Form
					initialValues={modal.data}
					form={form}
					layout="vertical"
					onFinish={onFinish}>
					{(modal.type === "UPDATE_SHIPPED" ||
						modal.type === "UPDATE_DELIVERED") && (
						<Form.Item>
							<Upload
								beforeUpload={beforeUpload}
								listType="picture-card"
								onChange={handleChange}
								showUploadList={false}>
								{preview ? (
									<Image
										width={98}
										height={98}
										src={preview}
										preview={false}
										className="w-full! object-cover! rounded-sm!"
									/>
								) : (
									<div className="text-sm!">
										Unggah <br /> Bukti Foto
									</div>
								)}
							</Upload>
						</Form.Item>
					)}
					{(modal.type === "UPDATE_SHIPPED" ||
						modal.type === "UPDATE_SHIPPED_INFO") && (
						<>
							<Form.Item
								label={"Nomor Resi"}
								className="mb-6!"
								name={"trackingNumber"}
								required={false}
								rules={[
									{
										required: true,
										message: "Nomor resi wajib diisi"
									}
								]}>
								<Input type="text" placeholder="Masukkan nomor resi" />
							</Form.Item>
							<Form.Item
								label={"Biaya Pengiriman"}
								className="mb-6!"
								name={"fee"}
								required={false}
								rules={[
									{
										required: true,
										message: "Biaya pengiriman wajib diisi"
									}
								]}>
								<Input type="number" placeholder="50000" prefix="Rp" />
							</Form.Item>
							<Form.Item
								label={"Jasa Pengiriman"}
								className="mb-6!"
								name={"courier"}
								required={false}
								rules={[
									{
										required: true,
										message: "Jasa pengiriman wajib diisi"
									}
								]}>
								<Input type="text" placeholder="SiCepat" />
							</Form.Item>
						</>
					)}
					<Form.Item
						label={
							modal.type === "UPDATE_DELIVERED"
								? "Tanggal Diterima"
								: "Tanggal Pengiriman"
						}
						className="mb-6!"
						name={
							modal.type === "UPDATE_DELIVERED"
								? "deliveredAt"
								: "shippedAt"
						}
						required={false}
						rules={[
							{
								required: true,
								message: `${modal.type === "UPDATE_DELIVERED" ? "Tanggal diterima wajib diisi" : "Tanggal pengiriman wajib diisi"}`
							}
						]}>
						<DatePicker
							className="w-full!"
							needConfirm
							format={"DD-MM-YYYY"}
						/>
					</Form.Item>
					<button
						disabled={isPending}
						type="submit"
						className="w-full h-14 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl font-bold text-base shadow-md cursor-pointer transition-all active:scale-[0.98] focus:outline-none focus:ring-primary focus:ring-2">
						{isPending ? (
							<CircularLoading color="#FFFFFF" size={25} />
						) : (
							"Simpan"
						)}
					</button>
				</Form>
			</div>
		</div>
	)
}

export {
    StatusForm
}