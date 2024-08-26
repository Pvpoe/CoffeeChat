import os
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

client = WebClient(token=os.environ['SLACK_BOT_TOKEN'])

def send_message(channel, text):
  try:
      response = client.chat_postMessage(
          channel=channel,
          text=text
      )
  except SlackApiError as e:
      print(f"Error sending message: {e.response['error']}")

def get_users():
  try:
      response = client.users_list()
      return response['members']
  except SlackApiError as e:
      print(f"Error fetching users: {e.response['error']}")
      return []
def pair_users():
  users = get_users()
  # Filter out bots and deactivated users
  real_users = [user for user in users if not user['is_bot'] and user['deleted'] == False]

  # Pair users (you can make this more complex, but let's keep it simple)
  for i in range(0, len(real_users), 2):
      if i + 1 < len(real_users):
          user1 = real_users[i]
          user2 = real_users[i + 1]
          message = f"Hi <@{user1['id']}> and <@{user2['id']}>, you're paired for a virtual coffee!"
          send_message('#coffeechat', message)

pair_users()


