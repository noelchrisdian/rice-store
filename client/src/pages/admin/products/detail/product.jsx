import { handleCurrency } from "../../../../utils/price";
import { Image } from "antd";

const ProductSection = ({ product }) => {
	return (
		<section className="pb-4 px-3 lg:pl-6">
			<div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden p-4">
				<div className="flex gap-4 mb-4">
					<Image
						src={product?.image?.imageURL}
						width={110}
						height={110}
						className="rounded-xl! object-cover! bg-muted! w-28!"
					/>
					<div className="flex-1 min-w-0">
						<h2 className="font-heading text-2xl font-bold text-foreground mb-2">
							{product?.name}
						</h2>
						<p className="text-sm text-muted-foreground mb-3 leading-relaxed">
							{product?.description}
						</p>
						<div className="flex items-center gap-2 mb-3">
							<span
								className={`text-xs px-2.5 py-1 rounded-md ${
									product?.stock >= 10
										? "bg-primary/10 text-primary"
										: product.stock === 0
											? "bg-destructive/80 text-white"
											: "bg-orange-500 text-white"
								} font-medium`}>
								{product?.stock >= 10
									? "Tersedia"
									: product.stock === 0
										? "Habis"
										: "Stok Menipis"}
							</span>
						</div>
						<p className="font-font-heading text-3xl font-bold text-primary">
							{handleCurrency(product?.price)}
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

export {
    ProductSection
}