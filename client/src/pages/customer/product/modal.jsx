import { CircleCheck, Contact } from "lucide-react";
import { Modal } from "antd";

const ProductModal = ({
	type,
	modalUser,
	navigate,
	openModal,
	product,
	setModalUser,
	setOpenModal
}) => {
	return type === "navigation" ? (
		<Modal
			open={openModal}
			onCancel={() => setOpenModal(false)}
			title={null}
			centered
			footer={null}
			styles={{
				content: {
					borderRadius: "36px",
					overflow: "hidden"
				}
			}}
			width={380}>
			<div className="bg-card p-6">
				<div className="flex flex-col items-center text-center mb-6">
					<div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
						<CircleCheck className="size-10 fill-primary text-white" />
					</div>
					<h2 className="font-heading text-2xl font-bold text-foreground mb-2">
						Item berhasil ditambah
					</h2>
					<p className="text-base text-muted-foreground">
						{product?.name} berhasil ditambahkan ke keranjang belanja Anda
					</p>
				</div>

				<div className="space-y-3">
					<button
						onClick={() => {
							setOpenModal(false);
							navigate("/cart");
						}}
						className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
						<span>Lihat Keranjang</span>
					</button>

					<button
						onClick={() => {
							setOpenModal(false);
							navigate("/#product");
						}}
						className="w-full h-14 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-base transition-transform flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
						<span>Lanjutkan Belanja</span>
					</button>
				</div>
			</div>
		</Modal>
	) : (
		type === "authentication" && (
			<Modal
				open={modalUser}
				onCancel={() => setModalUser(false)}
				title={null}
				centered
				footer={null}
				styles={{
					content: {
						padding: 0,
						borderRadius: "36px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<div className="bg-card p-6">
					<div className="flex flex-col items-center text-center mb-6">
						<div className="size-20 p-1 bg-primary rounded-full flex items-center justify-center mb-4">
							<Contact className="size-12 text-white" />
						</div>
						<h2 className="font-heading text-2xl font-bold text-foreground mb-2">
							Masuk ke Akun Anda
						</h2>
						<p className="text-base text-muted-foreground">
							Anda perlu masuk ke akun Anda untuk dapat menambahkan
							produk ke keranjang belanja
						</p>
					</div>

					<div className="space-y-3">
						<button
							onClick={() => {
								setModalUser(false);
								navigate("/sign-in");
							}}
							className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
							<span>Masuk</span>
						</button>

						<button
							onClick={() => {
								setModalUser(false);
								navigate("/sign-up");
							}}
							className="w-full h-14 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-base cursor-pointer transition-transform flex items-center justify-center gap-2 active:scale-[0.98]">
							<span>Daftar</span>
						</button>
					</div>
				</div>
			</Modal>
		)
	)
}

export {
    ProductModal
}