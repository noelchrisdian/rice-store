import { handleCurrency } from "../../../../utils/price";
import { Image } from "antd";

const ItemSection = ({ order }) => {
	return (
		<div className="bg-card rounded-2xl border border-border p-4">
			<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
				Item Pesanan
			</h2>
			<div className="space-y-4">
				{order?.products.map((product) => (
					<div
						className="flex items-center gap-3 pb-4 border-b border-border last:border-b-0"
						key={product?.product?._id}>
						<Image
							src={product?.product?.image?.imageURL}
							height={85}
							width={85}
							className="rounded-xl! object-cover! bg-muted! border! border-border/50!"
						/>
						<div className="flex-1 min-w-0">
							<p className="font-semibold text-sm text-foreground">
								{product?.product?.name}
							</p>
							<div className="text-xs text-muted-foreground mt-1">
								{product?.quantity} x{" "}
								{handleCurrency(product?.product?.price)}
							</div>
							<p className="font-semibold text-foreground mt-2">
								{handleCurrency(
									product?.product?.price * product?.quantity
								)}
							</p>
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