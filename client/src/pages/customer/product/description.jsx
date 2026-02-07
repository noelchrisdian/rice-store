import { handleCurrency } from "../../../utils/price";
import {
	Heart,
	Leaf,
	Star
} from "lucide-react";
import { Rate } from "antd";

const DescriptionSection = ({ product, reviews }) => {
	const analytics = reviews?.analytics;

	return (
		<div className="mb-6">
			<h2 className="font-font-heading text-3xl font-bold text-foreground mb-4">
				{product?.name}
			</h2>
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-4">
					<div className="flex items-center gap-1">
						<Rate disabled value={analytics?.average} />
					</div>
					<span className="text-base font-bold text-foreground">
						{analytics?.average}
					</span>
					<span className="text-sm text-muted-foreground">
						{analytics?.total} ulasan
					</span>
				</div>
				<div className="flex items-baseline gap-2">
					<span className="text-4xl font-bold text-primary">
						{handleCurrency(product?.price)}
					</span>
					<span className="text-lg text-muted-foreground">/ 5kg</span>
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
								menghasilkan tekstur dan aroma alami yang konsisten
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
								Memiliki karakteristik indeks glikemik yang lebih
								stabil, cocok bagi Anda yang memperhatikan asupan gula
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export {
	DescriptionSection
}