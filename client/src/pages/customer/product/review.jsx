import "dayjs/locale/id";
import "swiper/swiper.css";
import "swiper/css/pagination";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Autoplay, Pagination } from "swiper/modules";
import { handlePercentage } from "../../../utils/percentage";
import { Progress, Rate } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";

const ReviewSection = ({ reviews, totalReviews }) => {
	dayjs.extend(relativeTime);
	dayjs.locale("id");
	const analytics = reviews?.analytics;
	const stars = [5, 4, 3, 2, 1];

	return (
		<div className="bg-card rounded-2xl p-5 border border-border shadow-sm mb-6">
			<h3 className="font-font-heading text-xl font-bold text-foreground mb-4">
				Ulasan
			</h3>
			<div className="lg:grid lg:grid-cols-2 lg:gap-10">
				<div className="flex items-center gap-4 mb-6 pb-6 border-b border-border lg:border-r lg:border-b-0 lg:pr-6">
					<div className="text-center">
						<div className="text-5xl font-bold text-foreground mb-1">
							{analytics?.average}
						</div>
						<Rate value={analytics?.average} disabled className="mb-3!" />
						<div className="text-sm text-muted-foreground">
							{analytics?.total} ulasan
						</div>
					</div>
					<div className="flex-1 space-y-2">
						{stars.map((star, index) => {
							const count = Number(analytics?.[`star${star}`] || 0);
							return (
								<div className="flex items-center gap-2" key={index}>
									<span className="text-sm text-foreground w-8">
										{star}★
									</span>
									<Progress
										percent={handlePercentage(count, totalReviews)}
										showInfo={false}
										strokeColor={"#3D6F2E"}
										style={{ width: "80%" }}
									/>
									<span className="text-sm text-muted-foreground w-10 text-right">
										{count}
									</span>
								</div>
							)
						})}
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
						loop={reviews?.reviews.length > 1}>
						{reviews?.reviews.map((review, index) => (
							<SwiperSlide key={index}>
								<div className="border-border">
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
													{dayjs(review?.createdAt).fromNow()}
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
	)
}

export {
    ReviewSection
}