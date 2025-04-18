


export function getUniquePayments(tools) {
    // Создаем объект для хранения уникальных платежных методов
    const paymentMap = {};


    // Проходим по всем инструментам в tools
    Object.values(tools).forEach(tool => {
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

