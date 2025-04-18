import walletsData from '../../data/wallet.json';

export function getWalletChains ()  {
    const paymentMap = {};


    // Проходим по всем инструментам в tools
    Object.values(walletsData.Data.wallets.tools).forEach(tool => {
      // Обрабатываем каждый способ оплаты
      tool.payment.forEach(payment => {


        // Добавляем в paymentMap только если еще не существует
        if (!paymentMap[payment.name]) {
          paymentMap[payment.name] = {
            name: payment.name,
            icon: payment.icon
          };
        }
      });
    });

    // Преобразуем объект в массив и возвращаем
    return Object.values(paymentMap);
  }
}