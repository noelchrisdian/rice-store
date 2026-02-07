import { handleDate } from "../../../../utils/date";
import { handlePercentage } from "../../../../utils/percentage";
import {
	Image,
	Pagination,
	Progress,
	Rate
} from "antd";
import { Trash } from "lucide-react";

const ReviewSection = ({
	limit,
	page,
	reviews,
	searchParams,
	setModal,
	setSearchParams
}) => {
	const totalReviews = Number(reviews?.analytics?.total || 0);
	const analytics = reviews?.analytics;
	const stars = [5, 4, 3, 2, 1];

	return (
		<section className="px-3 lg:pr-6">
			<div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden p-4">
				<div className="mb-4 p-4 bg-muted rounded-xl">
					<div className="flex items-center gap-4 mb-4 lg:gap-8">
						<div className="text-center">
							<p className="font-heading text-4xl font-bold text-primary mb-1">
								{analytics?.average}
							</p>
							<div className="flex items-center justify-center gap-1 mb-1.5">
								<Rate
									disabled
									defaultValue={Number(analytics?.average || 0)}
								/>
							</div>
							<p className="text-xs text-muted-foreground">
								{Number(analytics?.total || 0)} ulasan
							</p>
						</div>
						<div className="flex-1 space-y-2">
							{stars.map((star) => {
								const count = Number(analytics?.[`star${star}`] || 0);
								return (
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground w-8">
											{star}★
										</span>
										<Progress
											percent={handlePercentage(
												Number(count),
												totalReviews
											)}
											showInfo={false}
											strokeColor={"#3D6F2E"}
											style={{ width: "60%" }}
										/>
										<span className="text-xs text-muted-foreground w-10 text-right">
											{count}
										</span>
									</div>
								)
							})}
						</div>
					</div>
				</div>
				<div className="space-y-3">
					{reviews?.reviews.map((review) => (
						<div className="p-4 bg-muted rounded-xl" key={review?._id}>
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
											<button
												onClick={() =>
													setModal({
														open: true,
														reviewID: review._id
													})
												}
												className="p-1.5 rounded-lg bg-destructive/10 text-destructive transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-destructive/50">
												<Trash className="size-4" />
											</button>
										</div>
									</div>
									<div className="flex items-center gap-1 mb-2">
										<Rate disabled value={review.rating} />
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
							current={page}
							pageSize={limit}
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
	)
}

export {
	ReviewSection
}