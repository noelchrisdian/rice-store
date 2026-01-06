import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { findOrder } from "../../services/orders";

const CustomerCheckout = () => {
    const [searchParams] = useSearchParams();
    const orderID = searchParams.get('order_id');

    const { data } = useQuery({
        queryFn: async () => {
            const result = await findOrder(orderID);
            return result.data;
        }
    }) 

    return (
        <main className="min-h-screen bg-background text-foreground font-sans">
            <section className="px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-180px)]">
                {data?.payment?.status === 'settlement' && (
                    <div className="flex flex-col items-center mb-12">
                        <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <CircleCheck className="size-14 fill-primary text-primary-foreground"/>
                        </div>
                        <h2 className="font-font-heading text-3xl font-bold text-center mb-2">
                            Pembayaran Berhasil
                        </h2>
                        <p className="text-primary text-center text-sm">Pesanan Anda berhasil dikonfirmasi</p>
                    </div>
                )}
                <div className="w-full max-w-md space-y-3">
                    <Link to={`/orders/${orderID}`} className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98]">Lihat Detail Pesanan</Link>
                    <Link to={'/'} className="w-full flex items-center justify-center bg-secondary text-secondary-foreground font-semibold py-4 rounded-xl transition-all cursor-pointer active:scale-[0.98]">Lanjut Belanja</Link>
                </div>
            </section>
        </main>
    )
}

export {
    CustomerCheckout
}