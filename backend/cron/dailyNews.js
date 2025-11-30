const cron = require("node-cron");
const Subscriber = require("../models/subscriber.model");
const { getCyberNews } = require("../services/news.service");
const { sendMail } = require("../services/mailer");

cron.schedule("0 9 * * *", async () => {
  const users = await Subscriber.find();
  const news = await getCyberNews();

  const html = news
    .map(n => `<p><b>${n.title}</b><br/>${n.url}</p>`)
    .join("");

  for (let user of users) {
    await sendMail(
      user.email,
      "🛡 Daily Cybersecurity News – TheCyberCastle",
      html
    );
  }

  console.log("✅ Daily cyber news sent");
});
