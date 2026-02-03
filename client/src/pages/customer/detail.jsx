import "dayjs/locale/id";
import "swiper/swiper.css";
import "swiper/css/pagination";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { addItem } from "../../services/carts";
import {
	ArrowLeft,
	CircleCheck,
	Contact,
	Heart,
	Leaf,
	ShoppingBag,
	Star
} from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { CircularLoading } from "respinner";
import { Footer } from "../../components/footer";
import { getSession } from "../../utils/axios";
import { handleCurrency } from "../../utils/price";
import {
	Modal,
	Progress,
	Rate
} from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const CustomerProductDetail = () => {
	const navigate = useNavigate();
	const session = getSession();
	const { product, reviews } = useLoaderData();
	const [openModal, setOpenModal] = useState(false);
	const [modalUser, setModalUser] = useState(false);

	const handleCancel = () => {
		setOpenModal(false);
	}

	dayjs.extend(relativeTime);
	dayjs.locale("id");

	const totalReviews = reviews?.analytics?.total;
	const handlePercentage = (data) =>
		data > 0 ? (data * totalReviews) / 100 : 0;

	const { isPending, mutateAsync } = useMutation({
		mutationFn: (data) => addItem(data)
	})

	const handleAddItem = async () => {
		const data = {
			products: [
				{
					product: product._id,
					quantity: 1
				}
			]
		}

		try {
			if (!session || session.role === "admin") {
				setModalUser(true);
				return;
			}

			await mutateAsync(data);
			setOpenModal(true);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [])

	return (
		<main className="relative bg-background min-h-screen text-foreground font-sans">
			<button
				className="fixed top-4 left-4 z-10 p-2 bg-primary text-primary-foreground rounded-full shadow-lg transition-all cursor-pointer active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50 lg:top-6 lg:left-5"
				onClick={() => navigate(-1)}>
				<ArrowLeft className="size-6" />
			</button>

			<section className="lg:max-w-7xl lg:mx-auto lg:relative">
				<section className="w-full aspect-square bg-secondary p-4 rounded-3xl lg:max-w-md lg:mt-4">
					<img
						alt={product?.name}
						src={product?.image?.imageURL}
						className="w-full h-full object-cover rounded-2xl"
					/>
				</section>
				<section className="px-5 pt-6 pb-2 bg-background lg:pb-16">
					<div className="mb-6">
						<h2 className="font-font-heading text-3xl font-bold text-foreground mb-4">
							{product?.name}
						</h2>
						<div className="mb-8">
							<div className="flex items-center gap-3 mb-4">
								<div className="flex items-center gap-1">
									<Rate
										disabled
										allowHalf
										value={reviews?.analytics?.average}
									/>
								</div>
								<span className="text-base font-bold text-foreground">
									{reviews?.analytics?.average}
								</span>
								<span className="text-sm text-muted-foreground">
									{reviews?.analytics?.total} ulasan
								</span>
							</div>
							<div className="flex items-baseline gap-2">
								<span className="text-4xl font-bold text-primary">
									{handleCurrency(product?.price)}
								</span>
								<span className="text-lg text-muted-foreground">
									/ 5kg
								</span>
							</div>
						</div>
						<div className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-6">
							<h3 className="font-font-heading text-xl font-bold text-foreground mb-3">
								Tentang Produk
							</h3>
							<p className="text-base text-muted-foreground leading-relaxed mb-5">
								{product?.description}
							</p>
							<div className="space-y-3">
								<div className="flex items-start gap-3">
									<div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
										<Leaf className="size-5 text-primary fill-primary" />
									</div>
									<div className="">
										<h4 className="font-semibold text-foreground mb-1">
											100% Organik
										</h4>
										<p className="text-sm text-muted-foreground">
											Tanpa pengawet dan pestisida
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
										<Star className="size-5 text-primary fill-primary" />
									</div>
									<div className="">
										<h4 className="font-semibold text-foreground mb-1">
											Kualitas Premium
										</h4>
										<p className="text-sm text-muted-foreground">
											Beras pilihan dengan masa simpan optimal untuk
											menghasilkan tekstur dan aroma alami yang
											konsisten
										</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
										<Heart className="size-5 text-primary fill-primary" />
									</div>
									<div className="">
										<h4 className="font-semibold text-foreground mb-1">
											Pilihan Sehat
										</h4>
										<p className="text-sm text-muted-foreground">
											Memiliki karakteristik indeks glikemik yang
											lebih stabil, cocok bagi Anda yang
											memperhatikan asupan gula
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-6">
						<h3 className="font-font-heading text-xl font-bold text-foreground mb-4">
							Ulasan
						</h3>
						<div className="lg:grid lg:grid-cols-2 lg:gap-10">
							<div className="flex items-center gap-4 mb-6 pb-6 border-b border-border lg:border-r lg:border-b-0 lg:pr-6">
								<div className="text-center">
									<div className="text-5xl font-bold text-foreground mb-1">
										{reviews?.analytics?.average}
									</div>
									<Rate
										defaultValue={5}
										disabled
										allowHalf
										className="mb-3!"
									/>
									<div className="text-sm text-muted-foreground">
										{reviews?.analytics?.total} ulasan
									</div>
								</div>
								<div className="flex-1 space-y-2">
									<div className="flex items-center gap-2">
										<span className="text-sm text-foreground w-8">
											5★
										</span>
										<Progress
											percent={handlePercentage(
												Number(reviews?.analytics?.star5)
											)}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "80%" }}
										/>
										<span className="text-sm text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star5)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm text-foreground w-8">
											4★
										</span>
										<Progress
											percent={handlePercentage(
												Number(reviews?.analytics?.star4)
											)}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "80%" }}
										/>
										<span className="text-sm text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star4)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm text-foreground w-8">
											3★
										</span>
										<Progress
											percent={handlePercentage(
												Number(reviews?.analytics?.star3)
											)}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "80%" }}
										/>
										<span className="text-sm text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star3)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm text-foreground w-8">
											2★
										</span>
										<Progress
											percent={handlePercentage(
												Number(reviews?.analytics?.star2)
											)}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "80%" }}
										/>
										<span className="text-sm text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star2)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-sm text-foreground w-8">
											1★
										</span>
										<Progress
											percent={handlePercentage(
												Number(reviews?.analytics?.star1)
											)}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "80%" }}
										/>
										<span className="text-sm text-muted-foreground w-10 text-right">
											{Number(reviews?.analytics?.star1)}
										</span>
									</div>
								</div>
							</div>
							<div className="space-y-4">
								<Swiper
									modules={[Autoplay, Pagination]}
									spaceBetween={30}
									slidesPerView={"auto"}
									autoplay={{
										delay: 4000,
										disableOnInteraction: false
									}}
									pagination={{ clickable: true }}
									scrollbar={{ draggable: true }}
									grabCursor
									loop={reviews?.reviews.length > 1}
								>
									{reviews?.reviews.map((review, index) => (
										<SwiperSlide key={index}>
											<div className="pb-4 border-border">
												<div className="flex items-start gap-3 mb-3">
													<img
														src={review?.user?.avatar?.imageURL}
														className="size-10 rounded-full object-cover"
													/>
													<div className="flex-1">
														<div className="flex items-center justify-between mb-1">
															<h4 className="font-semibold text-foreground">
																{review?.user?.name}
															</h4>
															<span className="text-xs text-muted-foreground">
																{dayjs(
																	review?.createdAt
																).fromNow()}
															</span>
														</div>
														<div className="flex items-center gap-1 mb-2">
															<Rate
																disabled
																allowHalf
																value={review?.rating}
															/>
														</div>
													</div>
												</div>
												<p className="text-base text-muted-foreground leading-relaxed">
													{review?.comment}
												</p>
											</div>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</div>
					</div>
					<div className="bg-secondary/50 rounded-2xl p-5 mb-6">
						<h3 className="font-font-heading text-xl font-bold text-foreground mb-3">
							Cara Memasak
						</h3>
						<div className="space-y-3">
							<div className="flex gap-3">
								<div className="size-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
									1
								</div>
								<p className="text-base text-foreground pt-1">
									Cuci beras 2 - 3 kali hingga air bilasan terlihat
									jernih.
								</p>
							</div>
							<div className="flex gap-3">
								<div className="size-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
									2
								</div>
								<p className="text-base text-foreground pt-1">
									Masukkan beras ke dalam wadah, lalu tambahkan air
									dengan perbandingan 1 : 1.5 (1 cup beras dengan 1.5
									cup air).
								</p>
							</div>
							<div className="flex gap-3">
								<div className="size-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
									3
								</div>
								<p className="text-base text-foreground pt-1">
									Masukkan wadah ke dalam rice cooker, tekan tombol{" "}
									<span className="italic">Cook</span>, dan tunggu
									hingga matang.
								</p>
							</div>
							<div className="flex gap-3">
								<div className="size-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
									4
								</div>
								<p className="text-base text-foreground pt-1">
									Setelah matang, diamkan selama 5 menit. Buka
									tutupnya, lalu aduk nasi perlahan agar tekstur lebih
									mekar, pulen, dan tidak menggumpal.
								</p>
							</div>
						</div>
					</div>
				</section>
				<div className="fixed bottom-0 left-0 right-0 px-5 py-4 z-20 shadow-lg lg:absolute lg:shadow-none">
					<button
						disabled={isPending}
						className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
						onClick={() => handleAddItem()}>
						{isPending ? (
							<CircularLoading size={26} color="#FFFFFF" />
						) : (
							<>
								<ShoppingBag className="size-6" />
								<span>Tambah ke Keranjang</span>
							</>
						)}
					</button>
				</div>
			</section>
			<Modal
				open={openModal}
				title={null}
				centered
				closeIcon={null}
				footer={null}
				styles={{
					content: {
						borderRadius: "36px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<div className="bg-card p-6">
					<div className="flex flex-col items-center text-center mb-6">
						<div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
							<CircleCheck className="size-10 fill-primary text-white" />
						</div>
						<h2 className="font-heading text-2xl font-bold text-foreground mb-2">
							Item berhasil ditambah
						</h2>
						<p className="text-base text-muted-foreground">
							{product?.name} berhasil ditambahkan ke keranjang belanja
							Anda
						</p>
					</div>

					<div className="space-y-3">
						<button
							onClick={() => navigate("/cart")}
							className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
							<span>Lihat Keranjang</span>
						</button>

						<button
							onClick={handleCancel}
							className="w-full h-14 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-base transition-transform flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
							<span>Lanjutkan Belanja</span>
						</button>
					</div>
				</div>
			</Modal>
			<Modal
				open={modalUser}
				onCancel={() => setModalUser(false)}
				title={null}
				centered
				footer={null}
				styles={{
					content: {
						padding: 0,
						borderRadius: "36px",
						overflow: "hidden"
					}
				}}
				width={380}>
				<div className="bg-card p-6">
					<div className="flex flex-col items-center text-center mb-6">
						<div className="size-20 p-1 bg-primary rounded-full flex items-center justify-center mb-4">
							<Contact className="size-12 text-white" />
						</div>
						<h2 className="font-heading text-2xl font-bold text-foreground mb-2">
							Masuk ke Akun Anda
						</h2>
						<p className="text-base text-muted-foreground">
							Anda perlu masuk ke akun Anda untuk dapat menambahkan
							produk ke keranjang belanja
						</p>
					</div>

					<div className="space-y-3">
						<button
							onClick={() => {
								setModalUser(false);
								navigate("/sign-in");
							}}
							className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold text-base transition-transform shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]">
							<span>Masuk</span>
						</button>

						<button
							onClick={() => {
								setModalUser(false);
								navigate("/sign-up");
							}}
							className="w-full h-14 bg-secondary text-secondary-foreground rounded-2xl font-semibold text-base cursor-pointer transition-transform flex items-center justify-center gap-2 active:scale-[0.98]">
							<span>Daftar</span>
						</button>
					</div>
				</div>
			</Modal>
			<Footer />
		</main>
	)
}

export {
	CustomerProductDetail
}