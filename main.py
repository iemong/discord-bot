import os
import asyncio
import discord
import feedparser
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('DISCORD_TOKEN')
CHANNEL_ID = int(os.getenv('CHANNEL_ID'))
RSS_URL = os.getenv('RSS_URL')t
CHECK_INTERVAL = 60 * 15  # 5分ごとにチェック

intents = discord.Intents.default()
client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f'Logged in as {client.user}')
    await check_rss()

async def check_rss():
    while True:
        feed = feedparser.parse(RSS_URL)
        if feed.entries:
            latest_entry = feed.entries[0]
            channel = client.get_channel(CHANNEL_ID)
            await channel.send(f"新しい記事: {latest_entry.title}\n{latest_entry.link}")
        await asyncio.sleep(CHECK_INTERVAL)

client.run(TOKEN)