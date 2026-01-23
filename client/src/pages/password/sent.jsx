import { Info, MailCheck } from "lucide-react";
import {
    Link,
    Navigate,
    useLocation
} from "react-router-dom";

const EmailSent = () => {
    const location = useLocation();

    if (!location.state?.fromForgot) {
        return <Navigate to={'/sign-in'} replace />
    }

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
				<div className="flex flex-col items-center text-center mb-6">
					<div className="size-16 bg-secondary rounded-full flex items-center justify-center text-primary mb-6">
						<MailCheck className="size-8" />
					</div>
					<h2 className="font-font-heading text-xl font-semibold text-foreground mb-3">
						Cek Email Anda
					</h2>
					<p className="text-sm text-muted-foreground leading-relaxed px-2">
						Kami telah mengirimkan tautan reset kata sandi ke email Anda.
						Silakan periksa inbox dan ikuti instruksi untuk mengatur ulang
						kata sandi.
					</p>
				</div>
				<div className="bg-muted rounded-xl p-4 mb-8 border border-border/30">
					<div className="flex gap-3">
						<Info className="size-5" />
						<div className="space-y-1">
							<p className="text-sm font-semibold text-foreground">
								Belum menemukan emailnya?
							</p>
							<p className="text-xs text-muted-foreground leading-relaxed">
								Periksa juga folder spam atau sampah jika email tidak
								ditemukan.
							</p>
						</div>
					</div>
				</div>
				<div className="space-y-4">
					<button onClick={() => window.location.href = 'mailto:'} className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-primary focus:ring-2 hover:opacity-90">
						Buka Email
					</button>
					<div className="flex items-center justify-center">
						<Link
							to={"/sign-in"}
							className="w-full rounded-xl py-3.5 border border-primary flex items-center justify-center gap-2 text-sm text-primary font-semibold focus:outline-none focus:ring-primary/50 focus:ring-1">
							Kembali
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export {
    EmailSent
}