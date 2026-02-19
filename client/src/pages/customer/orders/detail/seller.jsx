import { Store } from "lucide-react";

const SellerSection = () => {
	return (
		<div className="bg-card rounded-2xl border border-border p-4">
			<h2 className="font-font-heading text-lg font-bold text-foreground mb-4">
				Informasi Penjual
			</h2>
			<div className="flex items-start gap-3">
				<Store className="size-7 text-primary mt-0.5 shrink-0" />
				<div className="flex-1">
					<p className="text-sm text-foreground font-semibold mb-1">
						Toko Beras AD
					</p>
					<p className="text-sm text-muted-foreground leading-relaxed">
						Jalan Kedung Ombo A46
						<br />
						Lembah Hijau, Magelang 56172
						<br />
						Jawa Tengah, Indonesia
					</p>
				</div>
			</div>
		</div>
	)
}

export {
    SellerSection
}