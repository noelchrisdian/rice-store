import { Alert } from "antd";

const PendingAlert = ({ handlePayment, order }) => {
	return (
		<>
			{order?.payment?.status === "pending" &&
				new Date() <= new Date(order?.payment?.expiry_time) && (
					<Alert
						className="mt-6! mx-4! flex! items-center! rounded-lg! lg:max-w-185! lg:mx-auto!"
						banner
						showIcon
						description={"Menunggu pembayaran"}
						action={
							<button
								className="bg-orange-400 text-white py-1 px-3 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500"
								onClick={() => handlePayment()}>
								Bayar Sekarang
							</button>
						}
					/>
				)}
		</>
	)
}

export {
    PendingAlert
}