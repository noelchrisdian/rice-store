const CookingSection = () => {
	return (
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
						Cuci beras 2 - 3 kali hingga air bilasan terlihat jernih.
					</p>
				</div>
				<div className="flex gap-3">
					<div className="size-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
						2
					</div>
					<p className="text-base text-foreground pt-1">
						Masukkan beras ke dalam wadah, lalu tambahkan air dengan
						perbandingan 1 : 1.5 (1 cup beras dengan 1.5 cup air).
					</p>
				</div>
				<div className="flex gap-3">
					<div className="size-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
						3
					</div>
					<p className="text-base text-foreground pt-1">
						Masukkan wadah ke dalam rice cooker, tekan tombol{" "}
						<span className="italic">Cook</span>, dan tunggu hingga
						matang.
					</p>
				</div>
				<div className="flex gap-3">
					<div className="size-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shrink-0">
						4
					</div>
					<p className="text-base text-foreground pt-1">
						Setelah matang, diamkan selama 5 menit. Buka tutupnya, lalu
						aduk nasi perlahan agar tekstur lebih mekar, pulen, dan tidak
						menggumpal.
					</p>
				</div>
			</div>
		</div>
	)
}

export {
    CookingSection
}
