import {
    BadgeCheck,
    Coins,
    ThumbsUp
} from "lucide-react";

const BenefitSection = () => {
	return (
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
							Beras kami ditanam tanpa pestisida berbahaya, menjamin
							kemurnian dan keamanan bagi keluarga Anda.
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
							Kami menawarkan harga yang kompetitif tanpa mengorbankan
							kualitas layanan yang Anda terima
						</p>
					</div>
				</div>
				<div className="bg-card p-5 rounded-2xl flex items-start gap-4 shadow-sm border border-border/50">
					<div className="size-12 rounded-xl bg-chart-4/40 flex items-center justify-center shrink-0">
						<ThumbsUp className="text-primary size-7" />
					</div>
					<div className="space-y-1">
						<h3 className="font-bold text-lg">Hasil Panen Terbaik</h3>
						<p className="text-muted-foreground text-sm">
							Diproses sempurna untuk menghasilkan aroma khas dan tekstur
							pulen yang membuat setiap hidangan jadi istimewa
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}

export {
    BenefitSection
}