import { CircleAlert } from "lucide-react";
import { Modal } from "antd";

const ReviewModal = ({
	handleCloseModal,
	handleUpdateReview,
	isPending,
	modal,
	product
}) => {
	return (
		<Modal
			open={modal.open}
			onCancel={handleCloseModal}
			onOk={() => handleUpdateReview(product._id, modal.reviewID)}
			title={
				<div className="flex flex-row items-center gap-2">
					<CircleAlert
						className={`${modal.deleted ? "text-primary" : "text-destructive"} size-6`}
					/>
					<p className="text-md">
						{modal.deleted ? "Pulihkan Ulasan" : "Hapus Ulasan"}
					</p>
				</div>
			}
			centered
			confirmLoading={isPending}
			okText={modal.deleted ? "Pulihkan" : "Hapus"}
			okButtonProps={{
				className: `${modal.deleted ? "bg-primary! border-primary!" : "bg-destructive! border-desctructive!"} text-white! shadow-none!`
			}}
			cancelText={"Batal"}
			cancelButtonProps={{
				className: `${modal.deleted ? "bg-slate-500! border-slate-500!" : "bg-primary! border-primary!"} text-white! shadow-none!`
			}}>
			<p className="text-sm font-semibold my-4">
				{modal.deleted
					? "Anda yakin ingin mengembalikan ulasan ini?"
					: "Anda yakin ingin menghapus ulasan ini?"}
			</p>
		</Modal>
	)
}

export {
    ReviewModal
}