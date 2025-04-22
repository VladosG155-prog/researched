import resProxyData from '../../data/resedentialproxy.json';
import mobProxyData from '../../data/mobileproxy.json';
import statProxyData from '../../data/statikproxy.json';

export const getProxyCountries = () => {
    const countries = new Map();

    const array = Object.entries(resProxyData.Data.proxy.residentialProxy.tools);
    const array2 = Object.entries(mobProxyData.Data.proxy.mobileProxy.tools);
    const array3 = Object.entries(statProxyData.Data.proxy.staticProxy.tools);

    const fullArray = [...array, ...array2, ...array3];

    fullArray.forEach(([_, data]) => {
        data.countries.forEach(item => {
            if (!countries.has(item.name)) {
                countries.set(item.name, { name: item.name, icon: item.icon });
            }
        });
    });

    console.log(Array.from(countries.entries()));

    // Преобразуем итератор entries в массив и мапим его
    return Array.from(countries.entries()).map(item => {
        const elem = item[1] ?? null;
        return elem;
    });
};