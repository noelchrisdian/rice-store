import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";

const RegisterSection = () => {
	return (
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
	)
}

export {
    RegisterSection
}