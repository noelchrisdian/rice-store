import { Alert } from "antd";

const StatusAlert = ({ order, setModal }) => {
	return (
		<>
			{order?.shipping?.status === "processing" && (
				<Alert
					type="info"
					banner
					showIcon
					description={"Pesanan siap dikirim?"}
					className="mt-6! mx-4! flex! items-center! rounded-lg! lg:max-w-185! lg:mx-auto!"
					action={
						<button
							className="bg-blue-600 text-white py-1 px-3 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-700"
							onClick={() =>
								setModal({ type: "UPDATE_SHIPPED", data: null })
							}>
							Ubah Status
						</button>
					}
				/>
			)}
			{order?.shipping?.status === "shipped" && (
				<Alert
					type="info"
					banner
					showIcon
					description={"Pesanan sudah diterima?"}
					className="mt-6! mx-4! flex! items-center! rounded-lg! lg:max-w-185! lg:mx-auto!"
					action={
						<button
							className="bg-blue-600 text-white py-1 px-3 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-700"
							onClick={() =>
								setModal({ type: "UPDATE_DELIVERED", data: null })
							}>
							Ubah Status
						</button>
					}
				/>
			)}
		</>
	)
}

export {
    StatusAlert
}