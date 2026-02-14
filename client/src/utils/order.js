const setPaymentStatus = (data) => {
    if (["settlement", "capture"].includes(data)) {
        return "Lunas";
    } else if (["deny", "cancel", "expire", "failure"].includes(data)) {
        return "Gagal";
    } else if (data === "pending") {
        return "Belum Lunas";
    }

    return 'Belum Lunas';
}

const setOrderStatus = (paymentData, shippingData) => {
    const status = setPaymentStatus(paymentData);
    if (status === 'Gagal') {
        return 'Dibatalkan';
    } else if (status === 'Belum Lunas') {
        return 'Belum Lunas';
    } else if (status === 'Lunas') {
        switch (shippingData) {
            case 'processing':
                return 'Diproses';
            case 'shipped':
                return 'Dikirim';
            case 'delivered':
                return 'Telah Diterima';
            default:
                return 'Diproses';
        }
    }
}

export {
    setOrderStatus,
    setPaymentStatus
}