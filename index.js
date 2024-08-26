const { WebClient } = require('@slack/web-api');
const dotenv = require('dotenv');
const cron = require('node-cron');

dotenv.config();

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

async function sendMessage(channel, text) {
    try {
        await client.chat.postMessage({
            channel: channel,
            text: text,
        });
        console.log('Message sent successfully!');
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

async function getUsers() {
    try {
        const result = await client.users.list();
        return result.members;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

async function pairUsers() {
    const users = await getUsers();
    const realUsers = users.filter(user => !user.is_bot && !user.deleted);

    for (let i = 0; i < realUsers.length; i += 2) {
        if (i + 1 < realUsers.length) {
            const user1 = realUsers[i];
            const user2 = realUsers[i + 1];
            const message = `Hi <@${user1.id}> and <@${user2.id}>, you're paired for a virtual coffee!`;
            await sendMessage('#general', message);
        }
    }
}

// Schedule the bot to run every 2 weeks
cron.schedule('0 0 * * 1/14', () => {
    console.log('Running the pairUsers function every 2 weeks...');
    pairUsers();
});

// Optional: Uncomment to test the function every minute
// cron.schedule('* * * * *', () => {
//     console.log('Running the pairUsers function every minute for testing...');
//     pairUsers();
// });
