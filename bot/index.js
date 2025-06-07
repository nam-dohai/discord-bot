require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

client.on('ready', () => {
  console.log(`🤖 Bot is ready! Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    if (commandName === 'addfund') {
      const amount = interaction.options.getInteger('amount');
      const description = interaction.options.getString('description') || '';
      const userId = interaction.user.id;

      await axios.post(`${API_BASE_URL}/funds`, {
        userId,
        amount,
        description,
      });

      await interaction.reply(`✅ Ghi nhận ${amount.toLocaleString()}₫: "${description}"`);
    }

    else if (commandName === 'balance') {
      const { data } = await axios.get(`${API_BASE_URL}/funds/balance`);
      console.log(data);
      
      let reply = `📌 Tổng quỹ: ${data.total.toLocaleString()}₫\n`;
      reply += data.details.map(d => `- <@${d.userId}>: ${d.amount.toLocaleString()}₫`).join('\n');

      await interaction.reply(reply);
    }

    else if (commandName === 'history') {
      const { data: history } = await axios.get(`${API_BASE_URL}/funds/history`);

      if (!history.length) {
        await interaction.reply('📭 Không có lịch sử đóng góp.');
        return;
      }

      const msg = history.map((item, i) => {
        const date = new Date(item.date).toLocaleDateString('vi-VN');
        return `${i + 1}. <@${item.userId}>: +${item.amount.toLocaleString()}₫ – ${item.description} (${date})`;
      }).join('\n');

      await interaction.reply(`📜 Lịch sử đóng góp:\n${msg}`);
    }

    else if (commandName === 'raise') {
      const item = interaction.options.getString('item');
      const price = interaction.options.getInteger('price');
      const userId = interaction.user.id;

      await axios.post(`${API_BASE_URL}/raises`, {
        userId,
        item,
        price,
      });

      await interaction.reply(`🛒 Đã đề xuất mua "${item}" với giá ${price.toLocaleString()}₫.`);
    }

  } catch (error) {
    console.error('❌ Lỗi gọi API:', error.response?.data || error.message);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp('⚠️ Đã có lỗi xảy ra khi xử lý.');
    } else {
      await interaction.reply('⚠️ Đã có lỗi xảy ra khi xử lý.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
