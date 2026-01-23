import "swiper/swiper.css";
import "swiper/css/pagination";
import {
	BadgeCheck,
	Coins,
	Eye,
	Sprout,
	ThumbsUp
} from "lucide-react";
import { Footer } from "../../components/Footer";
import { getGlobalProducts } from "../../services/products";
import { handleCurrency } from "../../utils/price";
import { Link, useLoaderData } from "react-router-dom";
import { Navbar } from "../../components/Navbar";
import { Autoplay, Pagination } from "swiper/modules";
import { Rate } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery } from "@tanstack/react-query";

const CustomerHome = () => {
	const { initial, reviews } = useLoaderData();
	const { data: products } = useQuery({
		queryKey: ["index-product"],
		queryFn: async () => {
			const result = await getGlobalProducts();
			return result.data;
		},
		initialData: initial,
		refetchInterval: 1000 * 60 * 10,
		refetchOnWindowFocus: true
	})

	return (
		<>
			<section className="hidden lg:block">
				<Navbar active={"home"} position={"top"} />
			</section>
			<main className="relative bg-background font-sans text-foreground min-h-screen">
				<section className="relative px-4 py-8 overflow-hidden lg:pt-28 lg:pb-8">
					<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/30 rounded-full blur-3xl -z-10" />
					<div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-chart-4/30 rounded-full blur-3xl -z-10" />
					<div className="lg:grid lg:grid-cols-2 lg:items-center lg:justify-center">
						<div className="space-y-3 max-w-[85%] mb-4 lg:pl-10">
							<span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs uppercase tracking-wider lg:text-sm">
								Kualitas Premium
							</span>
							<h1 className="font-font-heading text-4xl leading-[1.15] text-foreground lg:text-6xl">
								<span className="text-primary">Beras Pilihan</span>{" "}
								untuk Setiap Hidangan
							</h1>
							<p className="text-muted-foreground text-lg leading-relaxed">
								Kualitas beras terbaik yang terjaga kemurniannya, solusi
								praktis kebutuhan harian beras Anda.
							</p>
						</div>
						<div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-xl shadow-primary/10">
							<img
								src="/Hero.jpeg"
								alt=""
								className="w-full h-full object-cover object-bottom"
							/>
						</div>
					</div>
				</section>
				<section className="px-4 py-8 space-y-6 lg:pt-24 lg:pb-16">
					<div className="text-center space-y-2 lg:space-y-4">
						<h2 className="font-font-heading text-2xl font-bold lg:text-4xl">
							Kenapa harus Toko Beras AD?
						</h2>
						<p className="text-muted-foreground text-sm lg:text-lg">
							Kami bangga menghadirkan kualitas yang dapat Anda percaya
						</p>
					</div>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
						<div className="bg-card p-5 rounded-2xl flex items-start gap-4 shadow-sm border border-border/50">
							<div className="size-12 rounded-xl bg-chart-4/40 flex items-center justify-center shrink-0">
								<BadgeCheck className="text-primary size-7" />
							</div>
							<div className="space-y-1">
								<h3 className="font-bold text-lg">100% Organik</h3>
								<p className="text-muted-foreground text-sm">
									Beras kami ditanam tanpa pestisida berbahaya,
									menjamin kemurnian dan keamanan bagi keluarga Anda.
								</p>
							</div>
						</div>
						<div className="bg-card p-5 rounded-2xl flex items-start gap-4 shadow-sm border border-border/50">
							<div className="size-12 rounded-xl bg-chart-4/40 flex items-center justify-center shrink-0">
								<Coins className="text-primary size-7" />
							</div>
							<div className="space-y-1">
								<h3 className="font-bold text-lg">Harga Terjangkau</h3>
								<p className="text-muted-foreground text-sm">
									Kami menawarkan harga yang kompetitif tanpa
									mengorbankan kualitas layanan yang Anda terima
								</p>
							</div>
						</div>
						<div className="bg-card p-5 rounded-2xl flex items-start gap-4 shadow-sm border border-border/50">
							<div className="size-12 rounded-xl bg-chart-4/40 flex items-center justify-center shrink-0">
								<ThumbsUp className="text-primary size-7" />
							</div>
							<div className="space-y-1">
								<h3 className="font-bold text-lg">
									Hasil Panen Terbaik
								</h3>
								<p className="text-muted-foreground text-sm">
									Diproses sempurna untuk menghasilkan aroma khas dan
									tekstur pulen yang membuat setiap hidangan jadi
									istimewa
								</p>
							</div>
						</div>
					</div>
				</section>
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
				<section className="px-4 py-8 space-y-6 lg:pt-12 lg:pb-16">
					<h2 className="font-font-heading text-2xl font-bold text-center lg:text-4xl lg:pb-6">
						Apa Kata Pelanggan?
					</h2>
					<Swiper
						grabCursor
						scrollbar={{ draggable: true }}
						spaceBetween={20}
						slidesPerView={'auto'}
						modules={[Autoplay]}
						autoplay={{
							delay: 4000,
							disableOnInteraction: false
						}}
						loop={reviews.length > 1}
						className="flex flex-col gap-4 pb-4 -mx-4 px-4">
						{reviews.map((review, index) => (
							<SwiperSlide key={index}>
								<div className="min-w-70 bg-card p-5 rounded-2xl border border-border flex flex-col items-center text-center lg:w-full lg:max-w-4xl lg:mx-auto">
									<div className="flex items-center gap-1 mb-3 text-chart-5">
										<Rate disabled value={review?.rating} />
									</div>
									<p className="text-foreground text-sm leading-relaxed mb-2 lg:text-[16px]">
										{review?.comment}
									</p>
									<div className="flex items-center gap-3">
										<div className="">
											<p className="font-bold text-sm lg:text-lg">
												{review?.user?.name}
											</p>
										</div>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</section>
				<section className="px-4 pb-8">
					<div className="bg-primary rounded-3xl p-6 relative overflow-hidden text-primary-foreground">
						<div className="absolute top-0 right-0 -mr-12 -mt-12 size-32 bg-white/10 rounded-full" />
						<div className="absolute bottom-0 left-0 -ml-8 -mb-8 size-24 bg-white/10 rounded-full" />
						<div className="relative z-10 flex flex-col items-center text-center space-y-4">
							<div className="bg-white/20 p-3 rounded-full backdrop-blur-sm lg:p-5">
								<Sprout className="size-8 text-center text-white lg:size-10" />
							</div>
							<h2 className="font-font-heading text-2xl font-bold lg:text-4xl">
								Bergabunglah dengan Kami
							</h2>
							<p className="text-primary-foreground/90 text-sm max-w-xs lg:max-w-xl lg:text-lg">
								Nikmati proses belanja yang lebih cepat dan mudah untuk
								kebutuhan beras harian Anda
							</p>
							<div className="w-full max-w-lg space-y-3 pt-2">
								<Link
									to={"/sign-up"}
									className="w-full block bg-white text-primary font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95">
									Daftar Sekarang
								</Link>
							</div>
						</div>
					</div>
				</section>
				<Footer />
			</main>
			<section className="lg:hidden">
				<Navbar active={"home"} position={"bottom"} />
			</section>
		</>
	)
}

export {
	CustomerHome
}