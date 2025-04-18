
import tokenData from '../../data/chain.json'

export function getChains ()  {
    return Object.keys(tokenData)
}

export function getCexFilters (chain: string): string[]  {

    return tokenData[chain]


}