import { handleCurrency } from "../../../../utils/price";
import { Image } from "antd";

const ItemSection = ({ order, setModal }) => {
	return (
		<div className="bg-card rounded-2xl border border-border p-4">
			<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
				Item Pesanan
			</h2>
			<div className="space-y-4">
				{order?.products.map((product, index) => (
					<div
						className="flex items-center gap-3 pb-4 border-b border-border last:border-b-0"
						key={index}>
						<Image
							src={product?.product?.image?.imageURL}
							height={85}
							width={85}
							className="rounded-xl! object-cover! bg-muted! border! border-border/50!"
						/>
						<div className="flex-1 min-w-0">
							<h4 className="font-semibold text-sm text-foreground mb-1">
								{product?.product?.name}
							</h4>
							<p className="text-xs text-muted-foreground mb-1">
								{product?.product?.weightPerUnit} kg
							</p>
							<div className="text-xs text-muted-foreground mb-3">
								{product?.quantity} x{" "}
								{handleCurrency(product?.product?.price)}
							</div>
							<p className="font-semibold text-foreground">
								{handleCurrency(
									product?.product?.price * product?.quantity
								)}
							</p>
							{order?.shipping?.status === "delivered" &&
								!product?.reviewed && (
									<div className="flex justify-end">
										<button
											onClick={() =>
												setModal({
													open: true,
													data: product.product
												})
											}
											className="bg-none text-xs text-primary cursor-pointer hover:underline focus:outline-none focus:underline">
											Beri Ulasan
										</button>
									</div>
								)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export {
	ItemSection
}