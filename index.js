const express = require('express');
const axios = require('axios');

const { config } = require('./package.json');

const url = process.env.HOST || config.host;
const token = process.env.token || config.token;
const channelId = process.env.channelId || config.channelId;


const app = express();
app.use(express.json());

app.post(`/${token}`, async function (req, res) {
  if (!config.whitelistIds.includes(req.body.message.from.id)) {
    console.warn("unauthorized access", req.body);
    res.send('OK');
    return;
  }
  try{
    await sendMessage(req.body.message.text);
  } catch (e) {
    console.error(e)
  }
  res.send('OK');
});

app.listen(3000, function () {
  console.log('bot listening 3000');
  setWebhook();
});

async function setWebhook() {
  await axios.get(`https://api.telegram.org/bot${token}/setWebhook?url=${url}/${token}`);
  console.log('webhook was set');
}

async function sendMessage(text) {
  await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: channelId,
    text
  });
}