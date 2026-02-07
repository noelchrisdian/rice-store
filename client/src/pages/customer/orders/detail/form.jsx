import { CircularLoading } from "respinner";
import {
    Form,
    Input,
    Rate
} from "antd";

const ReviewForm = ({ form, modal, onFinish, pending }) => {
	return (
		<div className="bg-card">
			<div className="space-y-6 p-2 max-h-[80vh] overflow-y-auto">
				<div className="flex items-center gap-3">
					<div className="size-12 bg-secondary rounded-xl overflow-hidden shrink-0">
						<img
							alt={modal.data?.name}
							src={modal.data?.image?.imageURL}
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="">
						<p className="font-bold text-lg text-foreground">
							{modal.data?.name}
						</p>
						<p className="text-xs text-muted-foreground">
							Bagikan pengalaman Anda dengan produk ini
						</p>
					</div>
				</div>
				<Form form={form} onFinish={onFinish}>
					<div className="space-y-3">
						<Form.Item
							name={"rating"}
							required={false}
							className="[&_.ant-form-item-explain]:mt-2"
							rules={[{ required: true, message: "Rating wajib diisi" }]}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "0.5rem",
								marginBlock: "0.75rem"
							}}>
							<Rate className="ant-rate-review" allowClear={false} />
						</Form.Item>
					</div>
					<div className="mb-7 space-y-2">
						<label
							htmlFor="comment"
							className="text-sm font-semibold text-foreground px-1">
							Berikan ulasan Anda
						</label>
						<Form.Item
							name={"comment"}
							required={false}
							className="[&_.ant-form-item-explain]:my-2"
							rules={[
								{ required: true, message: "Ulasan wajib diisi" }
							]}>
							<Input.TextArea
								id="comment"
								className="w-full! min-h-35! bg-input/50! border-none! rounded-2xl! p-4! text-foreground! placeholder:text-muted-foreground! focus:ring-2! focus:ring-primary/50! focus:outline-none! resize-none! mt-2!"
							/>
						</Form.Item>
					</div>
					<button
						disabled={pending}
						type="submit"
						className="w-full h-14 bg-primary text-primary-foreground flex items-center justify-center rounded-2xl font-bold text-base shadow-md cursor-pointer transition-all active:scale-[0.98] focus:outline-none focus:ring-primary focus:ring-2">
						{pending ? (
							<CircularLoading color="#FFFFFF" size={30} />
						) : (
							"Kirim Ulasan"
						)}
					</button>
				</Form>
			</div>
		</div>
	)
}

export {
    ReviewForm
}