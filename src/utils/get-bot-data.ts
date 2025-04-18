import tradeBots from '../../data/tradebots.json'


export const getTradingBotsInterface = () => {
    const networks = new Map()

    const array = Object.entries(tradeBots.Data.tradingBots.tools)

    array.forEach(([_,data])=>{
        data.interface.forEach(item=>{
            if(!networks.has( item)){
                networks.set( item, {name:  item})
            }
        })


        })

    return Array.from(networks?.entries().map(item=>item[1]))

}