import {
    BanknoteArrowDown,
    ClipboardClock,
    TriangleAlert,
    User,
    UserCog
} from "lucide-react";
import { Navbar } from "../../components/Navbar";

const AdminHome = () => {
    return (
        <>
            <section className="hidden lg:block">
                <Navbar active={'home'} position={'top'}/>
            </section>
            <main className="bg-background text-foreground font-sans flex flex-col min-h-screen lg:py-20">
                <section className="mb-4">
                    <div className="flex-1 py-10 px-6 justify-center items-center">
                        <div className="w-full max-w-sm mx-auto md:max-w-3xl lg:max-w-3xl">
                            <div className="bg-linear-to-br from-primary to-primary/80 rounded-2xl relative overflow-hidden p-10">
                                <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
                                <div className="absolute bottom-0 left-0 size-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl" />
                                <div className="relative z-10 text-center">
                                    <div className="size-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 mx-auto mb-4">
                                        <UserCog className="size-10 text-white" />
                                    </div>
                                    <h2 className="font-heading text-xl text-white mb-2">Selamat datang, Admin!</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="grid grid-cols-2 gap-2.5 px-6 lg:max-w-4xl lg:mx-auto lg:flex lg:flex-row lg:justify-center lg:px-16">
                        <div className="bg-card rounded-xl border border-border/50 shadow-sm p-3 lg:p-6 lg:w-sm">
                            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 lg:size-16 lg:mb-3">
                                <ClipboardClock className="size-5 text-primary lg:size-6"/>
                            </div>
                            <p className="font-heading text-2xl font-bold text-foreground mb-1 ml-2 lg:text-3xl lg:mb-2 lg:ml-1">24</p>
                            <p className="text-xs text-muted-foreground lg:text-sm">Pesanan Hari Ini</p>
                        </div>
                        <div className="bg-card rounded-xl border border-border/50 shadow-sm p-3 lg:p-6 lg:w-sm">
                            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 lg:size-16 lg:mb-3">
                                <User className="size-5 text-primary lg:size-6"/>
                            </div>
                            <p className="font-heading text-2xl font-bold text-foreground mb-1 ml-2 lg:text-3xl lg:mb-2 lg:ml-1">1.248</p>
                            <p className="text-xs text-muted-foreground lg:text-sm">Jumlah Pengguna</p>
                        </div>
                        <div className="bg-card rounded-xl border border-border/50 shadow-sm p-3 lg:p-6 lg:w-sm">
                            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 lg:size-16 lg:mb-3">
                                <BanknoteArrowDown className="size-5 text-primary lg:size-6"/>
                            </div>
                            <p className="font-heading text-2xl font-bold text-foreground mb-1 ml-2 lg:text-3xl lg:mb-2 lg:ml-1">1.248</p>
                            <p className="text-xs text-muted-foreground lg:text-sm">Pendapatan Hari Ini</p>
                        </div>
                        <div className="bg-card rounded-xl border border-border/50 shadow-sm p-3 lg:p-6 lg:w-sm">
                            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 lg:size-16 lg:mb-3">
                                <TriangleAlert className="size-5 text-primary lg:size-6"/>
                            </div>
                            <p className="font-heading text-2xl font-bold text-foreground mb-1 ml-2 lg:text-3xl lg:mb-2 lg:ml-1">2</p>
                            <p className="text-xs text-muted-foreground lg:text-sm">Stok Menipis</p>
                        </div>
                    </div>
                </section>
            </main>
            <section className="lg:hidden">
                <Navbar active={'home'} position={'bottom'}/>
            </section>
        </>
    )
}

export {
    AdminHome
}