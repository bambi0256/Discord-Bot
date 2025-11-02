// index.js
// Discord.js v14 사용
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const token = process.env.TOKEN;
const sourceChannelId = process.env.SOURCE_CHANNEL_ID;
const targetChannelId = process.env.TARGET_CHANNEL_ID;

// 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,           // 서버 관련 이벤트 수신
    GatewayIntentBits.GuildMessages,    // 메시지 이벤트 수신
    GatewayIntentBits.MessageContent    // 메시지 내용 접근 (봇 권한 필요)
  ],
  partials: [Partials.Channel, Partials.Message] // 일부 캐시되지 않은 메시지 접근
});

// 봇이 준비되면 콘솔에 로그 출력
client.once('clientReady', () => {
  console.log(`✅ 봇 로그인 완료: ${client.user.tag}`);
});

// 메시지가 생성될 때 실행되는 이벤트
client.on('messageCreate', async (message) => {
  try {
    // 1️⃣ 봇 자신의 메시지나 DM은 무시
    if (message.author.bot || !message.guild) return;

    // 2️⃣ 특정 채널(sourceChannelId)에서만 동작
    if (message.channel.id !== sourceChannelId) return;

    // 3️⃣ 대상 채널 가져오기
    const targetChannel = await client.channels.fetch(targetChannelId);
    if (!targetChannel) {
      console.error('❌ 대상 채널을 찾을 수 없습니다.');
      return;
    }

    // 4️⃣ 메시지 내용 복사
    const content = message.content || '';
    const files = message.attachments.map(att => att.url); // 첨부파일 URL 추출

    // 5️⃣ 대상 채널에 메시지 전송
    await targetChannel.send({
      content: `📢 **${message.author.tag}** 님의 새 메시지:\n${content}`,
      files: files
    });

    console.log(`📨 ${message.author.tag}의 메시지를 복사했습니다.`);
  } catch (error) {
    console.error('⚠️ 메시지 복사 중 오류 발생:', error);
  }
});

// 봇 실행
client.login(token);

