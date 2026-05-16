import { useState } from "react";

const PLATFORMS = ["Instagram", "LinkedIn", "Twitter/X", "Facebook", "TikTok"];
const CONTENT_TYPES = ["Motivational", "Educational", "Promotional", "Personal Story", "Tips & Tricks", "Industry News"];
const TONES = ["Professional", "Casual", "Funny", "Inspirational", "Formal"];

const PLATFORM_ICONS = {
  "Instagram": "📸",
  "LinkedIn": "💼",
  "Twitter/X": "🐦",
  "Facebook": "👥",
  "TikTok": "🎵"
};

const PLATFORM_COLORS = {
  "Instagram": "#E1306C",
  "LinkedIn": "#0A66C2",
  "Twitter/X": "#000000",
  "Facebook": "#1877F2",
  "TikTok": "#FF0050"
};

export default function SocialPostGenerator() {
  const [platform, setPlatform] = useState("Instagram");
  const [contentType, setContentType] = useState("Motivational");
  const [tone, setTone] = useState("Casual");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [postCount, setPostCount] = useState(3);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [copiedPost, setCopiedPost] = useState(null);

  const generatePosts = async () => {
    setLoading(true);
    setPosts([]);

    const prompt = `Generate exactly ${postCount} social media posts for ${platform}.

Details:
- Content Type: ${contentType}
- Tone: ${tone}
- Topic: ${topic || "General engaging content"}
- Target Audience: ${audience || "General audience"}
- Keywords: ${keywords || "Relevant keywords"}
- Include emojis: ${includeEmojis}
- Include hashtags: ${includeHashtags}

Return ONLY a valid JSON array. No markdown, no explanation, no backticks. Just the raw JSON array.

Format:
[
  {
    "hook": "Catchy opening line",
    "body": "Main content of the post",
    "cta": "Call to action",
    "hashtags": "#tag1 #tag2 #tag3"
  }
]

Make each post unique, engaging, and platform-appropriate for ${platform}.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setPosts(parsed);
    } catch (err) {
      setPosts([{ hook: "⚠️ Error", body: "Could not generate posts. Please try again.", cta: "", hashtags: "" }]);
    }

    setLoading(false);
  };

  const copyPost = (post, idx) => {
    const text = `${post.hook}\n\n${post.body}\n\n${post.cta}${includeHashtags ? "\n\n" + post.hashtags : ""}`;
    navigator.clipboard.writeText(text);
    setCopiedPost(idx);
    setTimeout(() => setCopiedPost(null), 2000);
  };

  const toggleLike = (idx) => {
    setLikedPosts(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const accentColor = PLATFORM_COLORS[platform];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e8e8f0",
      padding: "0"
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, #12121a 0%, #1a1a2e 100%)`,
        borderBottom: `1px solid ${accentColor}33`,
        padding: "28px 40px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(20px)"
      }}>
        <div style={{
          width: 44, height: 44,
          borderRadius: "12px",
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "22px"
        }}>
          {PLATFORM_ICONS[platform]}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: 700, letterSpacing: "-0.5px" }}>
            PostCraft
          </h1>
          <p style={{ margin: 0, fontSize: "12px", color: "#888", letterSpacing: "0.5px" }}>
            AI-POWERED SOCIAL MEDIA GENERATOR
          </p>
        </div>
      </div>

      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "32px 24px",
        display: "grid",
        gridTemplateColumns: "340px 1fr",
        gap: "28px",
        alignItems: "start"
      }}>
        {/* Left Panel - Controls */}
        <div style={{
          background: "#12121a",
          borderRadius: "20px",
          border: "1px solid #ffffff10",
          padding: "24px",
          position: "sticky",
          top: "90px"
        }}>
          <p style={{ margin: "0 0 20px", fontSize: "11px", letterSpacing: "1.5px", color: "#666", textTransform: "uppercase" }}>
            Configuration
          </p>

          {/* Platform */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.5px" }}>
              PLATFORM
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "8px",
                    border: platform === p ? `1px solid ${PLATFORM_COLORS[p]}` : "1px solid #ffffff15",
                    background: platform === p ? `${PLATFORM_COLORS[p]}22` : "transparent",
                    color: platform === p ? PLATFORM_COLORS[p] : "#666",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {PLATFORM_ICONS[p]} {p}
                </button>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.5px" }}>
              CONTENT TYPE
            </label>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid #ffffff15",
                background: "#1a1a26",
                color: "#e8e8f0",
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              {CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Tone */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.5px" }}>
              TONE
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {TONES.map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: tone === t ? `1px solid ${accentColor}` : "1px solid #ffffff15",
                    background: tone === t ? `${accentColor}22` : "transparent",
                    color: tone === t ? accentColor : "#666",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "8px", fontWeight: 600, letterSpacing: "0.5px" }}>
              TOPIC (OPTIONAL)
            </label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g., Remote work productivity tips..."
              rows={3}
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: "10px", border: "1px solid #ffffff15",
                background: "#1a1a26", color: "#e8e8f0",
                fontSize: "13px", resize: "none", boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Audience */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "8px", fontWeight: 600, letterSpacing: "0.5px" }}>
              TARGET AUDIENCE
            </label>
            <input
              value={audience}
              onChange={e => setAudience(e.target.value)}
              placeholder="e.g., Startup founders, Students..."
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: "10px", border: "1px solid #ffffff15",
                background: "#1a1a26", color: "#e8e8f0",
                fontSize: "13px", boxSizing: "border-box", fontFamily: "inherit"
              }}
            />
          </div>

          {/* Keywords */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "8px", fontWeight: 600, letterSpacing: "0.5px" }}>
              KEYWORDS
            </label>
            <input
              value={keywords}
              onChange={e => setKeywords(e.target.value)}
              placeholder="productivity, growth, success..."
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: "10px", border: "1px solid #ffffff15",
                background: "#1a1a26", color: "#e8e8f0",
                fontSize: "13px", boxSizing: "border-box", fontFamily: "inherit"
              }}
            />
          </div>

          {/* Post Count + Toggles */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "10px", fontWeight: 600, letterSpacing: "0.5px" }}>
              NUMBER OF POSTS: <span style={{ color: accentColor }}>{postCount}</span>
            </label>
            <input
              type="range" min={1} max={5} value={postCount}
              onChange={e => setPostCount(Number(e.target.value))}
              style={{ width: "100%", accentColor }}
            />
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
            {[["includeHashtags", includeHashtags, setIncludeHashtags, "# Hashtags"],
              ["includeEmojis", includeEmojis, setIncludeEmojis, "😊 Emojis"]].map(([key, val, setter, label]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#aaa" }}>
                <div
                  onClick={() => setter(!val)}
                  style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: val ? accentColor : "#333",
                    position: "relative", transition: "0.2s", cursor: "pointer"
                  }}
                >
                  <div style={{
                    position: "absolute", top: 2, left: val ? 18 : 2,
                    width: 16, height: 16, borderRadius: "50%",
                    background: "#fff", transition: "0.2s"
                  }} />
                </div>
                {label}
              </label>
            ))}
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePosts}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              background: loading ? "#333" : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "0.5px",
              transition: "all 0.3s",
              boxShadow: loading ? "none" : `0 8px 24px ${accentColor}44`
            }}
          >
            {loading ? "✨ Generating..." : `🚀 Generate ${postCount} Post${postCount > 1 ? "s" : ""}`}
          </button>
        </div>

        {/* Right Panel - Generated Posts */}
        <div>
          {!loading && posts.length === 0 && (
            <div style={{
              textAlign: "center", padding: "80px 40px",
              background: "#12121a", borderRadius: "20px",
              border: "1px dashed #ffffff15"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✍️</div>
              <h3 style={{ margin: "0 0 8px", color: "#666", fontWeight: 500 }}>Ready to create</h3>
              <p style={{ color: "#444", fontSize: "14px", margin: 0 }}>
                Configure your settings and hit Generate to get started
              </p>
            </div>
          )}

          {loading && (
            <div style={{
              textAlign: "center", padding: "80px 40px",
              background: "#12121a", borderRadius: "20px",
              border: `1px solid ${accentColor}33`
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px", animation: "spin 1s linear infinite" }}>⚡</div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <h3 style={{ margin: "0 0 8px", color: "#888" }}>Crafting your posts...</h3>
              <p style={{ color: "#555", fontSize: "14px", margin: 0 }}>AI is working its magic ✨</p>
            </div>
          )}

          {posts.map((post, idx) => (
            <div
              key={idx}
              style={{
                background: "#12121a",
                borderRadius: "20px",
                border: `1px solid #ffffff10`,
                marginBottom: "16px",
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s"
              }}
            >
              {/* Post Header */}
              <div style={{
                background: `linear-gradient(135deg, ${accentColor}22, transparent)`,
                borderBottom: `1px solid ${accentColor}22`,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "8px",
                    background: `${accentColor}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px"
                  }}>
                    {PLATFORM_ICONS[platform]}
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: accentColor }}>
                    Post {idx + 1} · {platform}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => toggleLike(idx)}
                    style={{
                      padding: "6px 12px", borderRadius: "8px", border: "none",
                      background: likedPosts[idx] ? "#ff4d6d22" : "#ffffff10",
                      color: likedPosts[idx] ? "#ff4d6d" : "#666",
                      cursor: "pointer", fontSize: "13px", transition: "all 0.2s"
                    }}
                  >
                    {likedPosts[idx] ? "❤️" : "🤍"} {likedPosts[idx] ? "Liked" : "Like"}
                  </button>
                  <button
                    onClick={() => copyPost(post, idx)}
                    style={{
                      padding: "6px 14px", borderRadius: "8px", border: "none",
                      background: copiedPost === idx ? `${accentColor}33` : "#ffffff10",
                      color: copiedPost === idx ? accentColor : "#888",
                      cursor: "pointer", fontSize: "13px", fontWeight: 600, transition: "all 0.2s"
                    }}
                  >
                    {copiedPost === idx ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
              </div>

              {/* Post Body */}
              <div style={{ padding: "20px 24px" }}>
                {post.hook && (
                  <p style={{
                    margin: "0 0 12px",
                    fontSize: "18px", fontWeight: 700,
                    lineHeight: 1.4, color: "#ffffff"
                  }}>
                    {post.hook}
                  </p>
                )}
                {post.body && (
                  <p style={{
                    margin: "0 0 14px",
                    fontSize: "14px", lineHeight: 1.7,
                    color: "#aaa", whiteSpace: "pre-line"
                  }}>
                    {post.body}
                  </p>
                )}
                {post.cta && (
                  <p style={{
                    margin: "0 0 14px",
                    fontSize: "14px", fontWeight: 600,
                    color: "#e8e8f0"
                  }}>
                    👉 {post.cta}
                  </p>
                )}
                {includeHashtags && post.hashtags && (
                  <p style={{
                    margin: 0, fontSize: "13px",
                    color: accentColor, fontWeight: 500, lineHeight: 1.6
                  }}>
                    {post.hashtags}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
