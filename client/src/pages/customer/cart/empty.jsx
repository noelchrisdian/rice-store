import { CircleQuestionMark, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const EmptySection = () => {
	return (
		<section className="min-h-screen flex items-center justify-center">
			<div className="flex-1 flex flex-col items-center justify-center pt-32 px-6 pb-20">
				<div className="relative mb-8 flex items-center justify-center">
					<div className="absolute size-64 rounded-full bg-secondary/30 blur-2xl" />
					<div className="absolute size-40 rounded-full bg-accent/40 blur-xl top-10 right-10" />
					<div className="relative z-10 flex flex-col items-center justify-center size-48 rounded-full bg-card shadow-[0_8px_30px_rgb(0, 0, 0, 0.04)] border border-border">
						<div className="relative">
							<ShoppingBag className="size-20 text-muted-foreground" />
							<div className="absolute -top-1 -right-1 flex items-center justify-center size-8 rounded-full bg-accent text-accent-foreground ring-4 ring-card">
								<CircleQuestionMark className="size-5 text-muted-foreground" />
							</div>
						</div>
					</div>
				</div>
				<div className="text-center space-y-3 max-w-lg mx-auto">
					<h2 className="text-3xl font-font-heading text-foreground">
						Keranjangmu masih kosong
					</h2>
					<p className="text-muted-foreground text-lg leading-relaxed">
						Sepertinya Anda belum memilih item favorit. Yuk, cek koleksi
						kami sekarang!
					</p>
				</div>
				<div className="max-w-lg mt-12 space-y-4">
					<Link
						to={"/#product"}
						className="w-full py-4 px-6 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
						Mulai Belanja
					</Link>
				</div>
			</div>
		</section>
	)
}

export {
    EmptySection
}