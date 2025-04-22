import tradeBots from '../../data/tradebots.json';

export const getTradingBotsInterface = () => {
    const networks = new Map();

    const array = Object.entries(tradeBots.Data.tradingBots.tools);

    array.forEach(([_, data]) => {
        data.interface.forEach(item => {
            const newEl = item.split(',');
            newEl.forEach(newElement => {
                if (!networks.has(newElement)) {
                    networks.set(newElement, { name: newElement });
                }
            });
        });
    });

    // Преобразуем итератор entries в массив и мапим его
    return [{name: 'TMA'}, {name: 'Сайт'}, {name: 'TG бот'}];
};