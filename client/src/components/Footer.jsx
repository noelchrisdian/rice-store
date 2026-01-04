import {
    Facebook,
    Instagram,
    Sprout,
    Twitter
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
	return (
		<footer className="absolute left-0 right-0 bg-foreground text-secondary py-10 px-6 rounded-t-3xl mt-4 pb-25 lg:pb-4">
			<div className="space-y-6">
				<div className="flex items-center justify-center gap-4">
					<Sprout className="text-primary size-6" />
					<span className="font-font-heading text-xl font-bold text-white">
						Toko Beras AD
					</span>
				</div>
				<div className="flex justify-center gap-4">
					<Link
						to={"https://facebook.com"}
						className="size-10 rounded-full bg-white/5 flex items-center justify-center transition-colors hover:bg-white/10">
						<Facebook className="text-white size-5" />
					</Link>
					<Link
						to={"https://instagram.com"}
						className="size-10 rounded-full bg-white/5 flex items-center justify-center transition-colors hover:bg-white/10">
						<Instagram className="text-white size-5" />
					</Link>
					<Link
						to={"https://x.com"}
						className="size-10 rounded-full bg-white/5 flex items-center justify-center transition-colors hover:bg-white/10">
						<Twitter className="text-white size-5" />
					</Link>
				</div>
				<p className="text-xs text-muted-foreground text-center">
					© 2025 Toko Beras AD. All rights reserved.
				</p>
			</div>
		</footer>
	)
}

export {
    Footer
}