import { Eye, SquarePen, Trash } from "lucide-react";
import { handleCurrency } from "../../../utils/price";
import { Image } from "antd";
import { Link } from "react-router-dom";

const ProductSection = ({ products, handleOpenModal }) => {
	return (
		<>
			{products?.map((product) => (
				<div
					className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full"
					key={product._id}>
					<div className="p-4 flex gap-3 lg:grid lg:grid-cols-1">
						<Image
							alt={product.name}
							width={95}
							src={product.image.imageURL}
							onClick={(e) => e.stopPropagation()}
							preview={true}
							className="size-12 rounded-xl object-cover bg-muted"
						/>
						<div className="flex-1 min-w-0 cursor-pointer">
							<div className="flex items-start justify-between gap-2 mb-1">
								<div className="flex-1 min-w-0">
									<h3 className="font-semibold text-foreground text-base truncate">
										{product.name}
									</h3>
								</div>
								<span
									className={`text-xs px-2 py-1 rounded-md ${
										product.stock >= 10
											? "bg-primary/10"
											: product.stock === 0
												? "bg-destructive/80 text-white"
												: "bg-orange-500 text-white"
									} text-primary font-medium whitespace-nowrap`}>
									{product?.stock >= 10
										? "Tersedia"
										: product?.stock === 0
											? "Habis"
											: "Stok Menipis"}
								</span>
							</div>
							<div className="flex items-center justify-between mt-2">
								<div>
									<p className="font-heading text-xl font-bold text-primary mb-2">
										{handleCurrency(product.price)}
									</p>
									<p className="text-xs text-muted-foreground">
										Stok : {product.stock}
									</p>
								</div>
								<div className="flex gap-1.5">
									<Link
										to={`/admin/products/${product._id}`}
										className="size-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center transition-transform
														cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
										<Eye className="size-4" />
									</Link>
									<Link
										to={`/admin/products/edit-product/${product._id}`}
										className="size-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center transition-transform
														cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
										<SquarePen className="size-4" />
									</Link>
									<button
										className="size-9 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center transition-transform cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-destructive/50"
										onClick={() => handleOpenModal(product)}>
										<Trash className="size-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</>
	)
}

export {
	ProductSection
}