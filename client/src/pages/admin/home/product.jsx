import { handleCurrency } from "../../../utils/price";
import { Image } from "antd";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const ProductSection = ({ recentProducts }) => {
	return (
		<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5">
			<div className="flex items-center justify-between mb-4">
				<h3 className="font-font-heading text-2xl font-semibold text-foreground">
					Produk
				</h3>
				<Link
					to={"/admin/products/add-product"}
					className="size-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 active:bg-primary/90">
					<Plus className="size-6" />
				</Link>
			</div>
			<div className="flex flex-col gap-3 mb-4">
				{recentProducts?.data.map((product) => (
					<div
						className="flex items-center gap-3 bg-muted rounded-xl p-3"
						key={product?._id}>
						<div className="size-16 bg-background rounded-lg flex items-center justify-center shrink-0">
							<Image
								width={75}
								src={product?.image?.imageURL}
								className="size-full! object-cover! rounded-lg!"
							/>
						</div>
						<div className="flex-1 min-w-0">
							<h4 className="font-semibold text-foreground text-sm mb-0.5 truncate">
								{product?.name}
							</h4>
							<p className="text-xs text-muted-foreground mb-1">
								Stok : {product?.stock} pcs
							</p>
							<p className="text-sm font-bold text-primary">
								{handleCurrency(product?.price)}
							</p>
						</div>
					</div>
				))}
				<Link
					to={"/admin/products"}
					className="w-full bg-primary text-primary-foreground flex justify-center rounded-xl py-3 font-medium transition-all active:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50">
					Lihat semua produk
				</Link>
			</div>
		</div>
	)
}

export {
    ProductSection
}