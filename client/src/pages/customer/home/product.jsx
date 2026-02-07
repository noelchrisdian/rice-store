import "swiper/swiper.css";
import "swiper/css/pagination";
import { Eye } from "lucide-react";
import { handleCurrency } from "../../../utils/price";
import { Link } from "react-router-dom";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductSection = ({ products }) => {
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
					{products.map(
						(product, index) =>
							product?.stock > 0 && (
								<SwiperSlide key={index}>
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
											<Link
												to={`/products/${product._id}`}
												className="size-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center transition-all active:scale-95 focus:outline-none focus:ring-primary focus:ring-2">
												<Eye className="size-4" />
											</Link>
										</div>
									</div>
								</SwiperSlide>
							)
					)}
				</Swiper>
			</div>
		</section>
	);
};

export { ProductSection };
