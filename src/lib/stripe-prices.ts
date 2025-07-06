export const subscriptionsPrices = [
    "price_1RhH4KQ5zWBsaZZn5C36TI55",
    "price_1RhqBFQ5zWBsaZZnyhksM9Tx",
    "price_1RhqAlQ5zWBsaZZnY5HihfRi",
    "price_1RhqAOQ5zWBsaZZnVIBavpkv"
]

export default function isExistsPrice(priceId: string): boolean {
  return !!subscriptionsPrices.find(realPriceId => realPriceId === priceId)
}