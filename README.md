# PostCraft — AI Social Media Post Generator

A React artifact that generates platform-optimized social media posts using the Claude API.

## Features

- **5 platforms:** Instagram, LinkedIn, Twitter/X, Facebook, TikTok
- **6 content types:** Motivational, Educational, Promotional, Personal Story, Tips & Tricks, Industry News
- **5 tones:** Professional, Casual, Funny, Inspirational, Formal
- Optional topic, target audience, and keyword inputs
- Generate 1–5 posts at once
- Toggle hashtags and emojis on/off
- Copy-to-clipboard and like/save buttons per post

## How It Works

Fills a structured prompt with your configuration and sends it to `claude-sonnet-4-20250514` via the Anthropic API. The model returns a raw JSON array of posts, each with a `hook`, `body`, `cta`, and `hashtags` field.

## Usage

1. Select a platform and content type
2. Choose a tone
3. (Optional) Add a topic, audience, and keywords
4. Set how many posts to generate
5. Hit **Generate**

## Stack

- React (hooks only, no dependencies)
- Anthropic `/v1/messages` API
- Inline CSS styling
