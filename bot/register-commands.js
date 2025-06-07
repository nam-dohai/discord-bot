require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('addfund')
    .setDescription('Thêm khoản tiền vào quỹ chung')
    .addIntegerOption(opt => opt.setName('amount').setDescription('Số tiền').setRequired(true))
    .addStringOption(opt => opt.setName('description').setDescription('Ghi chú')),
  
  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Xem số dư quỹ và đóng góp từng người'),

  new SlashCommandBuilder()
    .setName('history')
    .setDescription('Xem lịch sử đóng góp'),

  new SlashCommandBuilder()
    .setName('raise')
    .setDescription('Đề xuất mua món đồ')
    .addStringOption(opt => opt.setName('item').setDescription('Tên món đồ').setRequired(true))
    .addIntegerOption(opt => opt.setName('price').setDescription('Giá tiền').setRequired(true)),
  
  // Thêm các lệnh khác tương tự
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Đăng ký slash commands...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Đăng ký thành công!');
  } catch (error) {
    console.error(error);
  }
})();
