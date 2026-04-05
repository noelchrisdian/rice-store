import "swiper/swiper.css";
import "swiper/css/pagination";
import { handleCurrency } from "../../../utils/price";
import { Link } from "react-router-dom";
import { Pagination } from "swiper/modules";
import { Skeleton } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductSection = ({ products, isFetching }) => {
	return (
		<section
			className="px-4 pt-8 pb-6 bg-secondary/30 lg:pt-12 lg:pb-10"
			id="product">
			<div className="flex items-center mb-6">
				<h2 className="font-font-heading text-2xl font-bold lg:text-4xl">
					Produk Kami
				</h2>
			</div>
			<div className="lg:max-w-8xl lg:mx-auto">
				<Swiper
					modules={[Pagination]}
					spaceBetween={16}
					slidesPerView={"auto"}
					breakpoints={{
						1024: {
							slidesPerView: 3
						}
					}}
					pagination={{ clickable: true }}
					scrollbar={{ draggable: true }}
					grabCursor={true}>
					{isFetching ? (
						<SwiperSlide>
							<div className="bg-card rounded-2xl p-3 shadow-sm flex flex-col h-full">
								<div className="relative aspect-square rounded-xl overflow-hidden mb-3">
									<Skeleton.Image
										active
										block
										className="w-full! h-full!"
									/>
								</div>

								<Skeleton.Input
									active
									style={{ width: "80%", height: "20px" }}
									className="mb-6"
								/>

								<div className="mt-auto flex items-center justify-between">
									<Skeleton.Input
										active
										style={{ width: "40%", height: "18px" }}
									/>
									<Skeleton.Button
										active
										style={{ width: 20, height: 20 }}
										className="rounded-lg!"
									/>
								</div>
							</div>
						</SwiperSlide>
					) : (
						products.map(
							(product, index) =>
								product?.stock > 0 && (
									<SwiperSlide key={index}>
										<Link to={`/products/${product._id}`}>
											<div className="bg-card rounded-2xl p-3 shadow-sm flex flex-col h-full">
												<div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3">
													<img
														src={product?.image?.imageURL}
														className="w-full h-full object-cover"
													/>
												</div>
												<h3 className="font-bold text-base leading-tight mb-6">
													{product?.name}
												</h3>
												<div className="mt-auto flex items-center justify-between">
													<span className="font-bold text-lg text-primary">
														{handleCurrency(product?.price)}
													</span>
												</div>
											</div>
										</Link>
									</SwiperSlide>
								)
						)
					)}
				</Swiper>
			</div>
		</section>
	)
}

export {
	ProductSection
}