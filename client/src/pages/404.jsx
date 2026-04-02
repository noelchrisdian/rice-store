import { getSession } from "../utils/axios";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const NotFound = () => {
	const { data: session } = useQuery({
		queryKey: ["session"],
		queryFn: getSession,
		retry: false
	})

	return (
		<section className="bg-background font-sans text-foreground min-h-screen flex flex-col items-center justify-center px-6 text-center">
			<div className="mb-8">
				<img
					src="/404.png"
					alt="404 Not Found"
					className="max-w-xs md:max-w-md"
				/>
			</div>

			<h1 className="text-3xl font-bold mb-2">Halaman Tidak Ditemukan</h1>
			<p className="text-muted-foreground mb-8 max-w-lg">
				Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan
			</p>

			<Link
				to={session?.role === "admin" ? "/admin" : "/"}
				className="px-6 py-3 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
				Kembali ke Beranda
			</Link>
		</section>
	)
}

export {
	NotFound
}