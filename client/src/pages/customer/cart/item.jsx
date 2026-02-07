import { CircleMinus, CirclePlus } from "lucide-react";
import { CircularLoading } from "respinner";
import { handleCurrency } from "../../../utils/price";

const ItemSection = ({
	cartItem,
	handleAddQuantity,
	handleCreateOrder,
	handleRemoveQuantity,
	loadingItem,
	pending,
	total
}) => {
	return (
		<section className="lg:max-w-7xl lg:mx-auto">
			<div className="px-6 pt-8 pb-6 lg:pt-32">
				<div className="">
					<div className="space-y-4">
						{cartItem.map((item, index) => (
							<div
								className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm"
								key={index}>
								<div className="flex gap-4">
									<div className="w-24 h-24 rounded-xl bg-secondary overflow-hidden shrink-0">
										<img
											src={item?.product?.image?.imageURL}
											className="w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1 flex flex-col">
										<div className="flex justify-between items-start mb-2">
											<div className="">
												<h3 className="font-font-heading text-lg leading-tight mb-1">
													{item?.product?.name}
												</h3>
												<p className="text-sm text-muted-foreground mb-1.5">
													{item?.product?.weightPerUnit} kg
												</p>
												<span className="font-bold text-primary text-md">
													{handleCurrency(item?.product?.price)}
												</span>
											</div>
										</div>
										<div className="mt-2 flex items-center justify-end">
											<div className="flex items-center gap-3 bg-secondary rounded-lg px-1 py-1">
												<button
													disabled={
														loadingItem[item?.product?._id]
													}
													className="size-8 flex items-center justify-center text-primary cursor-pointer rounded-lg transition-all active:bg-primary/10"
													onClick={() =>
														handleRemoveQuantity(item)
													}>
													<CircleMinus className="size-5" />
												</button>
												<span className="font-semibold text-foreground min-w-5 text-center">
													{loadingItem[item?.product?._id] ? (
														<CircularLoading
															color="#3D6F2E"
															size={18}
														/>
													) : (
														item?.quantity
													)}
												</span>
												<button
													disabled={
														loadingItem[item?.product?._id]
													}
													className="size-8 flex items-center justify-center text-primary cursor-pointer rounded-lg transition-all active:bg-primary/10"
													onClick={() => handleAddQuantity(item)}>
													<CirclePlus className="size-5" />
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="px-6 pb-24">
				<div className="bg-card rounded-2xl border border-border/50 pt-5 px-5 pb-2 shadow-sm sticky top-2/4">
					<h3 className="font-font-heading text-xl font-semibold mb-6">
						Rincian Pesanan
					</h3>
					<div className="space-y-4 mb-6">
						<div className="flex justify-between text-sm">
							<div className="text-muted-foreground">Subtotal</div>
							<span className="font-medium text-foreground">
								{handleCurrency(total)}
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<div className="text-muted-foreground">Diskon</div>
							<span className="font-medium text-foreground">
								{handleCurrency(0)}
							</span>
						</div>
						<div className="border-t border-border pt-4 mb-6">
							<div className="flex justify-between items-baseline">
								<span className="text-foreground font-semibold">
									Total
								</span>
								<span className="font-font-heading text-3xl font-bold text-primary">
									{handleCurrency(total)}
								</span>
							</div>
						</div>
						<button
							disabled={pending}
							onClick={() => handleCreateOrder()}
							className="w-3xs mx-auto bg-primary text-primary-foreground font-bold p-4 rounded-xl cursor-pointer transition-all flex items-center justify-center shadow-lg text-lg shadow-primary/20 mb-2 mt-10 active:scale-[0.98]">
							{pending ? (
								<CircularLoading color="#FFFFFF" size={28} />
							) : (
								"Bayar"
							)}
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}

export {
    ItemSection
}