import { CircularLoading } from "respinner";
import { handleCurrency } from "../../../utils/price";
import { Plus } from "lucide-react";

const ProductCard = ({
	handleAddItem,
	isPending,
	product,
	quantity,
	setQuantity
}) => {
	return (
		<div className="bg-card border border-border w-80 h-fit mr-5 rounded-xl">
			<div className="p-6 space-y-4">
				<h2 className="font-font-heading text-xl text-foreground font-bold">
					Atur Pesanan
				</h2>
				<div className="grid grid-cols-3 gap-2">
					<div className="w-full border border-border rounded-sm overflow-hidden grid grid-cols-3 col-span-2">
						<button
							onClick={() => {
								setQuantity((prev) => prev - 1);
							}}
							disabled={quantity === 1}
							className="px-3 bg-muted cursor-pointer py-1 text-foreground font-bold disabled:cursor-not-allowed disabled:bg-gray-200/50">
							-
						</button>
						<span className="flex justify-center items-center text-foreground">
							{quantity}
						</span>
						<button
							disabled={quantity >= product?.stock}
							onClick={() => {
								setQuantity((prev) => prev + 1);
							}}
							className="px-3 bg-muted cursor-pointer py-1 text-foreground font-bold disabled:cursor-not-allowed disabled:bg-gray-200/50">
							+
						</button>
					</div>
					<div className="flex justify-center items-center col-span-1">
						<p className="text-md text-muted-foreground">
							Stok : {product?.stock}
						</p>
					</div>
				</div>
				<div className="flex items-center justify-between my-4">
					<h3 className="text-base leading-relaxed">Subtotal</h3>
					<h3 className="self-center justify-self-end text-2xl text-primary font-semibold">
						{handleCurrency(quantity * product?.price)}
					</h3>
				</div>
				<button
					disabled={isPending}
					className="w-full h-12 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
					onClick={() => handleAddItem()}>
					{isPending ? (
						<CircularLoading size={26} color="#FFFFFF" />
					) : (
						<>
							<Plus className="size-5" />
							<span>Keranjang</span>
						</>
					)}
				</button>
			</div>
		</div>
	)
}

export {
    ProductCard
}