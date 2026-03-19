import { CircleAlert } from "lucide-react";

const CartModal = ({ handleCloseModal, handleRemoveItem, modal }) => {
	return (
		<div className="bg-card p-4">
			<div className="flex flex-col items-center text-center mb-6">
				<div className="size-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
					<CircleAlert className="size-10 text-destructive" />
				</div>
				<h2 className="font-font-heading font-bold text-xl text-foreground mb-2">
					Hapus {modal.item?.product?.name} dari keranjang?
				</h2>
			</div>

			<div className="space-y-3">
				<button
					className="w-full h-14 bg-destructive text-primary-foreground rounded-2xl font-bold text-base transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
					onClick={() => handleRemoveItem(modal.item)}>
					<span>Hapus</span>
				</button>
				<button
					className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-semibold text-base transition-transform flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
					onClick={() => handleCloseModal()}>
					<span>Batal</span>
				</button>
			</div>
		</div>
	)
}

export {
    CartModal
}