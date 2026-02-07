import "swiper/swiper.css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { Rate } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";

const ReviewSection = ({ reviews }) => {
	return (
		<section className="px-4 py-8 space-y-6 lg:pt-12 lg:pb-16">
			<h2 className="font-font-heading text-2xl font-bold text-center lg:text-4xl lg:pb-6">
				Apa Kata Pelanggan?
			</h2>
			<Swiper
				grabCursor
				scrollbar={{ draggable: true }}
				spaceBetween={20}
				slidesPerView={"auto"}
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
	)
}

export {
    ReviewSection
}