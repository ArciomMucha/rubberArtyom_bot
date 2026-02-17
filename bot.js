import { Telegraf } from 'telegraf';
import { getWeatherInfo, interpretWeather } from './weather.js'; // Импорт функций
import { getCurrencyRates } from './currency.js';
import http from 'http';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    'Привет! Меня зовут Резиновый Артём! Я ассистент Саши Квачонок! Напиши /menu чтобы посмотреть возможности бота!',
  ),
);

bot.command('menu', (ctx) => {
  ctx.reply('Выберите действие:', {
    reply_markup: {
      keyboard: [[{ text: 'Погода 🌤️' }, { text: 'Курс валют 💵' }], [{ text: 'Помощь' }]],
      resize_keyboard: true,
    },
  });
});

bot.hears('Погода 🌤️', async (ctx) => {
  try {
    const data = await getWeatherInfo();
    await ctx.reply(
      `Сейчас в Минске:\n` +
        `${interpretWeather(data.weatherCode)}\n` +
        `🌡️ Температура: ${data.temp}°C\n` +
        `└ Ощущается как: ${data.apparentTemp}°C\n` +
        `💧 Влажность: ${data.humidity}%\n` +
        `💨 Скорость ветра: ${data.windSpeed} м/с`,
    );
  } catch (error) {
    console.error(error);
    ctx.reply('Ошибка при получении погоды 😔');
  }
});

bot.hears('Курс валют 💵', async (ctx) => {
  const rates = await getCurrencyRates();

  if (rates) {
    await ctx.reply(
      `💰 **Курсы валют:**\n\n` +
        `🇺🇸 1 USD = ${rates.USD} BYN\n` +
        `🇪🇺 1 EUR = ${rates.EUR} BYN\n` +
        `🇷🇺 100 RUB = ${rates.RUB} BYN\n\n` +
        `📅 _Данные на: ${rates.last_update}_`,
      { parse_mode: 'Markdown' },
    );
  } else {
    await ctx.reply('Не удалось получить данные о валютах😔');
  }
});
bot.hears('Помощь', (ctx) => ctx.reply('Напишите /help, чтобы узнать больше.'));

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running!');
});

bot.on('text', (ctx) => {
  ctx.reply(`Прости, Артём тебя не понимает... 🤖\nПоэтому соси хуй или пиши нормальные запросы!`, {
    reply_markup: {
      keyboard: [[{ text: 'Погода 🌤️' }, { text: 'Курс валют 💵' }], [{ text: 'Помощь' }]],
      resize_keyboard: true,
    },
  });
});

bot.launch();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
