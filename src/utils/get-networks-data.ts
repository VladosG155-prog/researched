import tradeBots from '../../data/tradebots.json';

export const getTradingBotsNetwork = () => {
    const networks = new Map();

    const array = Object.entries(tradeBots.Data.tradingBots.tools);

    array.forEach(([_, data]) => {
        data.networks.forEach(item => {
            if (!networks.has(item.name)) {
                networks.set(item.name, { name: item.name, icon: item.icon });
            }
        });
    });

    // Преобразуем итератор entries в массив и мапим его
    return Array.from(networks.entries()).map(item => item[1]);
};