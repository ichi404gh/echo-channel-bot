const Telegraf = require('telegraf')
const { config } = require('./package.json');
const channelId = config.channelId;
const token = process.env.token || config.token;

const bot = new Telegraf(token);

bot.catch(console.error);

function handleForward(ctx) {
  ctx.telegram.deleteMessage(
    ctx.update.message.forward_from_chat.id, 
    ctx.update.message.forward_from_message_id
  );
}

bot.start((ctx) => ctx.reply('Welcome!'));

bot.on('message', (ctx) => {
  if (
    ctx.update.message.forward_from_chat &&
    ctx.update.message.forward_from_chat.username == channelId.slice(1)) {
      handleForward(ctx);
      return;
  }
  console.log(ctx.update);
  if (!config.whitelistIds.includes(ctx.update.message.from.id)) {
    ctx.reply("You are not allowed to do this");
    return;
  }

  ctx.telegram.sendCopy(config.channelId, ctx.message)
});


bot.launch();
