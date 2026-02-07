const HeroSection = () => {
	return (
		<section className="relative px-4 py-8 overflow-hidden lg:pt-28 lg:pb-8">
			<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-accent/30 rounded-full blur-3xl -z-10" />
			<div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-chart-4/30 rounded-full blur-3xl -z-10" />
			<div className="lg:grid lg:grid-cols-2 lg:items-center lg:justify-center">
				<div className="space-y-3 max-w-[85%] mb-4 lg:pl-10">
					<span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs uppercase tracking-wider lg:text-sm">
						Kualitas Premium
					</span>
					<h1 className="font-font-heading text-4xl leading-[1.15] text-foreground lg:text-6xl">
						<span className="text-primary">Beras Pilihan</span> untuk
						Setiap Hidangan
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
	)
}

export {
    HeroSection
}