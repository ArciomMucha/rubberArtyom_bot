export async function getCurrencyRates() {
  const url = 'https://v6.exchangerate-api.com/v6/919e5e22a36729b3af525b8a/latest/byn';

  try {
    const response = await fetch(url);

    // Проверяем, что запрос прошел успешно (статус 200-299)
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();


    return {
      USD: (1 / data.conversion_rates.USD).toFixed(4),
      EUR: (1 / data.conversion_rates.EUR).toFixed(4),
      RUB: (100 / data.conversion_rates.RUB).toFixed(4),
      last_update: new Date(data.time_last_update_unix * 1000).toLocaleString(),
    };
    // Например, если в JSON есть поле "price":
    // console.log(data.price);
  } catch (error) {
    console.error('Произошла ошибка:', error.message);
  }
}
getCurrencyRates();
