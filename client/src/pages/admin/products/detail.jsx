import {
	ArrowLeft,
	Plus,
	SquarePen,
	Trash
} from "lucide-react";
import { columns as inventoriesColumns } from "../inventories/columns";
import { handleCurrency } from "../../../utils/price";
import { handleDate } from "../../../utils/date";
import {
	Image,
	Pagination,
	Progress,
	Rate,
	Table
} from "antd";
import {
	Link,
	useLoaderData,
	useSearchParams
} from "react-router-dom";

const AdminDetailProduct = () => {
	const { inventories, product, reviews } = useLoaderData();
	const [searchParams, setSearchParams] = useSearchParams();

	const currentPageInventory = Number(
		searchParams.get("inventoryPage") || reviews?.meta?.page || 1
	)
	const pageSizeInventory = Number(
		searchParams.get("inventoryLimit") || reviews?.meta?.limit || 10
	)

	const currentPageReview = Number(
		searchParams.get("reviewPage") || reviews?.meta?.page || 1
	)
	const pageSizeReview = Number(
		searchParams.get("reviewLimit") || reviews?.meta?.limit || 10
	)

	const totalReviews = reviews?.analytics?.total;
	const handlePercentage = (data) => data > 0 ? (data * totalReviews) / 100 : 0;

	return (
		<main className="bg-background font-sans text-foreground min-h-screen py-10 lg:py-20">
			<Link
				to={"/admin/products"}
				className="fixed top-4 left-4 z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:top-6 lg:left-5">
				<ArrowLeft className="size-6" />
			</Link>
			<section className="flex items-center justify-end pb-6 pr-4 lg:pr-6">
				<Link
					to={`/admin/products/edit-product/${product._id}`}
					className="flex bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm justify-center items-center gap-3 shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
					<SquarePen className="size-4" />
					Ubah Produk
				</Link>
			</section>
			<div className="lg:grid lg:grid-cols-2">
				<div className="">
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
					<section className="pb-4 px-3 lg:pl-6">
						<div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden p-4">
							<div className="flex items-center justify-end mb-3">
								<Link
									to={`/admin/products/${product._id}/inventories/add-inventory`}
									className="flex bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm justify-center items-center gap-3 shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
									<Plus className="size-4 bg-background rounded-full text-primary" />
									Buat Stok
								</Link>
							</div>
							<div className="overflow-x-auto -mx-4 px-4">
								<Table
									columns={inventoriesColumns(product._id)}
									dataSource={inventories.inventories}
									rowKey={"_id"}
									scroll={{ x: 600 }}
									pagination={{
										current: currentPageInventory,
										position: ["none", "bottomCenter"],
										pageSize: pageSizeInventory,
										showSizeChanger: true,
										total: inventories?.meta?.total,
										onChange: (page, pageSize) => {
											const params = new URLSearchParams(
												searchParams
											);
											params.set("inventoryLimit", String(pageSize));
											params.set("inventoryPage", String(page));
											setSearchParams(params);
										}
									}}
								/>
							</div>
						</div>
					</section>
				</div>
				<section className="px-3 lg:pr-6">
					<div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden p-4">
						<div className="mb-4 p-4 bg-muted rounded-xl">
							<div className="flex items-center gap-4 mb-4 lg:gap-8">
								<div className="text-center">
									<p className="font-heading text-4xl font-bold text-primary mb-1">
										{reviews?.analytics?.average}
									</p>
									<div className="flex items-center justify-center gap-1 mb-1.5">
										<Rate allowHalf defaultValue={Number(reviews?.analytics?.average)} />
									</div>
									<p className="text-xs text-muted-foreground">
										{Number(reviews?.analytics?.total)} ulasan
									</p>
								</div>
								<div className="flex-1 space-y-2">
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground w-8">
											5★
										</span>
										<Progress
											percent={handlePercentage(Number(reviews?.analytics?.star5))}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "60%" }}
										/>
										<span className="text-xs text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star5)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground w-8">
											4★
										</span>
										<Progress
											percent={handlePercentage(Number(reviews?.analytics?.star4))}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "60%" }}
										/>
										<span className="text-xs text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star4)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground w-8">
											3★
										</span>
										<Progress
											percent={handlePercentage(Number(reviews?.analytics?.star3))}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "60%" }}
										/>
										<span className="text-xs text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star3)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground w-8">
											2★
										</span>
										<Progress
											percent={handlePercentage(Number(reviews?.analytics?.star2))}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "60%" }}
										/>
										<span className="text-xs text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star2)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground w-8">
											1★
										</span>
										<Progress
											percent={handlePercentage(Number(reviews?.analytics?.star1))}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "60%" }}
										/>
										<span className="text-xs text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star1)}
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className="space-y-3">
							{reviews.reviews.map((review, index) => (
								<div className="p-4 bg-muted rounded-xl" key={index}>
									<div className="flex items-start gap-3 mb-3">
										<Image
											src={review.user.avatar.imageURL}
											width={35}
											height={35}
											className="rounded-full! object-cover! h-full! w-full!"
										/>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1">
												<h4 className="font-semibold text-sm text-foreground">
													{review.user.name}
												</h4>
												<div className="flex items-center gap-2">
													<span className="text-xs text-muted-foreground">
														{handleDate(review.createdAt)}
													</span>
													<button className="p-1.5 rounded-lg bg-destructive/10 text-destructive transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-destructive/50">
														<Trash className="size-4" />
													</button>
												</div>
											</div>
											<div className="flex items-center gap-1 mb-2">
												<Rate
													disabled
													defaultValue={review.rating}
												/>
											</div>
											<p className="text-sm text-foreground leading-relaxed">
												{review.comment}
											</p>
										</div>
									</div>
								</div>
							))}
							{reviews?.reviews.length > 0 && (
								<Pagination
									align="center"
									current={currentPageReview}
									pageSize={pageSizeReview}
									showSizeChanger
									total={reviews?.meta?.total}
									onChange={(page, pageSize) => {
										const params = new URLSearchParams(searchParams);
										params.set("reviewLimit", String(pageSize));
										params.set("reviewPage", String(page));
										setSearchParams(params);
									}}
								/>
							)}
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}

export {
	AdminDetailProduct
}