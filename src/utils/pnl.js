// Utility JS file

export function getLtp(ltp, position) {
    return ltp || position.last_price;
}

export function calculatePositionPnl(position, ltp) {
    let pnl = 0;
    let first_price = 0;

    const lastPrice = getLtp(ltp, position);  // Use the ltp passed into the function

    if (position.status === "CLOSED") {
        if (position.sell_price && position.buy_price) {
            pnl = (position.sell_price - position.buy_price) * position.quantity;
            first_price = position.buy_price;
        }
    } else if (position.status === "OPEN") {
        if (position.side === "BUY") {
            if (position.buy_price && lastPrice) {
                pnl = (lastPrice - position.buy_price) * position.quantity;
                first_price = position.buy_price;
            }
        } else if (position.side === "SELL") {
            if (position.sell_price && lastPrice) {
                pnl = (position.sell_price - lastPrice) * position.quantity;
                first_price = lastPrice;
            }
        }
    }

    const investment = first_price * position.quantity;
    const pnlPercentage = investment > 0 ? (pnl / investment) * 100 : 0;

    return {
        pnl: parseFloat(pnl.toFixed(2)),
        pnlPercentage: parseFloat(pnlPercentage.toFixed(2)),
    };
}
