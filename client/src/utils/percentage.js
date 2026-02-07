const handlePercentage = (data, totalReviews) => totalReviews > 0 ? (data / totalReviews) * 100 : 0;

export {
    handlePercentage
}