const setPaymentStatus = (data) => {
    if (["settlement", "capture"].includes(data)) {
        return "Berhasil";
    } else if (["deny", "cancel", "expire", "failure"].includes(data)) {
        return "Gagal";
    } else if (data === "pending") {
        return "Pending";
    }
}

export {
    setPaymentStatus
}