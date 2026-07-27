from fastapi import FastAPI, Depends
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import os
import feedparser
from bs4 import BeautifulSoup
from fastapi.responses import FileResponse
import uuid
import requests
import traceback

from database import engine, get_db
from models import  ScheduledPost
from sqlalchemy.orm import Session

from fastapi.middleware.cors import CORSMiddleware
#==================================
# LOAD ENVIRONMENT VARIABLES
# ==========================================

load_dotenv()
API_KEYS = [
    os.getenv("GEMINI_API_KEY_1"),
    os.getenv("GEMINI_API_KEY_2")
]
print(API_KEYS)
# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="EchoSocial AI Backend",
    description="AI Powered Social Media Assistant",
    version="1.0"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://echosocial-ai-frontend.onrender.com",
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ==========================================
# LOGIN
# ==========================================
@app.post("/login")
async def login(user: dict):

    email = user.get("email")
    password = user.get("password")

    if email and password:

        return {
            "success": True,
            "message": "Login successful",
            "name": email.split("@")[0]
        }

    return {
        "success": False,
        "message": "Please enter email and password"
    }
# ==========================================
# GEMINI HELPER FUNCTION
# ==========================================
def ask_gemini(prompt: str):

    for key in API_KEYS:

        try:

            client = genai.Client(
                api_key=key
            )

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            return response.text

        except Exception as e:

            print("API key failed:", e)

            continue

    return "AI service unavailable."


def generate_image(prompt):

    # Add your Stability AI API key here
    STABILITY_API_KEY = "YOUR_STABILITY_API_KEY_HERE"

    response = requests.post(

        "https://api.stability.ai/v2beta/stable-image/generate/core",

        headers={
            "Authorization": f"Bearer {STABILITY_API_KEY}",
            "Accept": "image/*"
        },

        files={
            "prompt": (None, prompt),
            "output_format": (None, "png")
        }

    )

    if response.status_code == 200:

        filename = f"images/{uuid.uuid4()}.png"

        os.makedirs("images", exist_ok=True)

        with open(filename, "wb") as file:
            file.write(response.content)

        return filename

    else:

        raise Exception(response.text)
# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Welcome to EchoSocial 🚀"
    }

# ==========================================
# MODELS
# ==========================================

class GeneratePost(BaseModel):
    platform: str
    topic: str
    tone: str
    length: str

class RewritePostRequest(BaseModel):
    platform: str
    post: str

class AnalyzePost(BaseModel):
    post: str


class HashtagRequest(BaseModel):
    topic: str

class GenerateThread(BaseModel):
    platform: str
    topic: str   

# ==========================================
# GENERATE SOCIAL MEDIA POST
# ==========================================
@app.post("/generate-post")
def generate_post(data: GeneratePost):

    if not data.topic.strip():
        return {
            "post": "Please enter a valid topic"
        }

    if not data.platform.strip():
        return {
            "post": "Please enter a valid platform"
        }

    try:

        prompt = f"""
Create ONLY ONE final social media post.

Platform: {data.platform}

Topic: {data.topic}

Tone: {getattr(data, "tone", "Professional")}

Length: {getattr(data, "length", "Medium")}

Rules:
- Return only one ready-to-publish post.
- Do NOT give multiple options.
- Do NOT write Option 1, Option 2, Option 3.
- Do NOT explain your choices.
- Do NOT add headings.
- Include suitable hashtags at the end.

Output only the final post text.
"""

        result = ask_gemini(prompt)

        return {
            "post": result
        }

    except Exception as e:
        traceback.print_exc()

        return {
            "post": "AI generation failed. Please try again.",
            "error": str(e)
        }

# ==========================================
# REWRITE POST
# ==========================================

@app.post("/rewrite-post")
def rewrite_post(data: RewritePostRequest):

    prompt = f"""
    Rewrite this social media post to make it more engaging and viral.

    Platform:
    {data.platform}

    Original Post:
    {data.post}

    Requirements:
    - Improve the hook
    - Make it more engaging
    - Keep it suitable for {data.platform}
    - Add better wording
    - Keep the original meaning
    - Do not add unnecessary information

    Return only the rewritten post.
    """

    rewritten = ask_gemini(prompt)

    return {
        "rewritten_post": rewritten
    }
# ==========================================
# generate-thread
# ==========================================

@app.post("/generate-thread")
def generate_thread(data: GenerateThread):

    if not data.topic.strip():
        return {
            "thread": "Please enter a valid topic."
        }

    try:

        prompt = f"""
Create a Twitter/X thread with EXACTLY 3 tweets.

Topic:
{data.topic}

Rules:
- Tweet 1: Strong hook.
- Tweet 2: Main insight.
- Tweet 3: Conclusion with a call-to-action.
- Keep each tweet under 280 characters.
- Number them as Tweet 1, Tweet 2, Tweet 3.
"""

        result = ask_gemini(prompt)

        return {
            "thread": result
        }

    except Exception as e:

        return {
            "thread": "AI generation failed. Please try again.",
            "error": str(e)
        }
# ==========================================
# ANALYZE POST
# ==========================================

@app.post("/analyze-post")
def analyze_post(data: AnalyzePost):

    prompt = f"""
    Analyze the following social media post.

    Give:

    1. Tone
    2. Readability
    3. Engagement Score (/10)
    4. Strengths
    5. Weaknesses
    6. Suggestions

    Post:

    {data.post}
    """

    return {
        "analysis": ask_gemini(prompt)
    }

# ==========================================
# ADDITIONAL MODELS
# ==========================================

class ContentIdeaRequest(BaseModel):
    niche: str


class MarketingStrategyRequest(BaseModel):
    business: str
    target_audience: str


class SEORequest(BaseModel):
    topic: str


class CaptionRequest(BaseModel):
    platform: str
    topic: str


class ScriptRequest(BaseModel):
    topic: str
    duration: str


class NewsSummaryRequest(BaseModel):
    news: str


class ImagePromptRequest(BaseModel):
    topic: str
    style: str


class GenerateImageRequest(BaseModel):
    prompt: str

class SchedulePostRequest(BaseModel):
    title: str
    platform: str
    type: str
    content: str
    date: str
    time: str
    status: str

class PublishPostRequest(BaseModel):
    post_id: int

# ==========================================
# CONTENT IDEAS
# ==========================================

@app.post("/content-ideas")
def content_ideas(data: ContentIdeaRequest):

    prompt = f"""
    Generate exactly 15 unique social media content ideas for:

    {data.niche}

   Rules:
   - Give exactly 15 ideas.
   - Each idea must be unique.
   - Give a short catchy title (3-6 words).
   - Add ONE short description (maximum 150-200 words).
   - Explain the idea clearly so a creator understands the content direction.
   - Do NOT use markdown (**).
   - Do NOT use headings like "Idea 1".
   - Do NOT use bullet points.
   - Separate each idea with a blank line only.

    Format:

    AI for Small Businesses
    Learn how AI helps startups save time and automate daily work.

    Future of Social Media
    Explore how AI is transforming content creation and audience engagement.
    """

    ideas = ask_gemini(prompt)

    return {
        "content_ideas": ideas
    }

# ==========================================
# MARKETING STRATEGY
# ==========================================

@app.post("/marketing-strategy")
def marketing_strategy(data: MarketingStrategyRequest):

    prompt = f"""
    Create a short digital marketing strategy for a social media dashboard.

    Business:
    {data.business}

    Target Audience:
    {data.target_audience}

    Give only:

    1. 🎯 Marketing Goal
    (2 lines)

    2. 📱 Social Media Strategy
    (3 bullet points)

    3. 🔍 SEO Strategy
    (2 bullet points)

    4. 📧 Email Campaign
    (2 bullet points)

    5. 💰 Paid Ads Recommendation
    (2 bullet points)

    6. 🚀 Quick Growth Tips
    (3 bullet points)

    Keep the response under 300 words.
    Use simple dashboard-friendly formatting.
    """

    return {
        "strategy": ask_gemini(prompt)
    }


# ==========================================
# SEO KEYWORDS
# ==========================================

@app.post("/seo-keywords")
def seo_keywords(data: SEORequest):

    prompt = f"""
    Generate 25 SEO keywords for:

    {data.topic}

    Return only keywords.
    """

    return {
        "keywords": ask_gemini(prompt)
    }


# ==========================================
# CAPTION GENERATOR
# ==========================================

@app.post("/caption-generator")
def caption_generator(data: CaptionRequest):

    prompt = f"""
    Generate an engaging {data.platform} caption.

    Topic:

    {data.topic}
    """

    return {
        "caption": ask_gemini(prompt)
    }


# ==========================================
# SHORT VIDEO SCRIPT
# ==========================================

@app.post("/script-generator")
def script_generator(data: ScriptRequest):

    prompt = f"""
    Write a {data.duration} video script.

    Topic:

    {data.topic}
    """

    return {
        "script": ask_gemini(prompt)
    }

# ==========================================
# NEWS SUMMARIZER
# ==========================================

@app.post("/summarize-news")
def summarize_news(data: NewsSummaryRequest):

        prompt = f"""
            You are an AI social media assistant.

            Analyze this news headline.

            Headline:
        {data.news}

        Respond in exactly this format:

    SUMMARY:
    Write 2 short paragraphs.

        KEY TAKEAWAYS:
        - Point 1
        - Point 2
        - Point 3

        CONTENT OPPORTUNITY:
        Explain in 3-4 lines how a creator or marketer can turn this news into engaging content.
"""
        try:
            summary = ask_gemini(prompt)
        except Exception:
            summary = (
            "Summary is temporarily unavailable because the AI service "
            "has reached its current usage limit. Please try again later."
        )

        return {
        "summary": summary
    }


# ==========================================
# IMAGE PROMPT GENERATOR
# ==========================================

@app.post("/generate-image-prompt")
def generate_image_prompt(data: ImagePromptRequest):

    prompt = f"""
    Create a detailed AI image generation prompt.

    Topic:
    {data.topic}

    Style:
    {data.style}

    Make it suitable for AI image generators.
    """

    return {
        "image_prompt": ask_gemini(prompt)
    }


# ==========================================
# TRENDS (PROTOTYPE)
# ==========================================

@app.get("/trends")
def trends():

    rss_url = "https://news.google.com/rss/search?q=artificial+intelligence+OR+social+media+OR+digital+marketing+OR+content+creation&hl=en-IN&gl=IN&ceid=IN:en"

    feed = feedparser.parse(rss_url)

    headlines = []

    for entry in feed.entries[:20]:

        title = BeautifulSoup(entry.title, "html.parser").text
        summary = ""

        if hasattr(entry, "summary"):
            summary = BeautifulSoup(entry.summary, "html.parser").text       

        lower = title.lower()

        if any(word in lower for word in ["openai", "google", "meta", "microsoft", "nvidia"]):
            label = "🔥 Breaking"

        elif any(word in lower for word in ["ai", "marketing", "social", "instagram", "linkedin", "youtube"]):
            label = "📈 Trending"

        elif any(word in lower for word in ["how", "what is", "guide", "explained"]):
            label = "💡 Idea"

        elif any(word in lower for word in ["shock", "disappear", "replace", "kill", "future"]):
            label = "⚡ Viral"

        elif any(word in lower for word in ["report", "study", "analysis", "research"]):
            label = "🧠 Insight"

        else:
            label = "🎯 Ready"

        headlines.append({
            "title": title,
            "summary": summary,
            "label": label
        })
    prompt = f"""
These are today's AI + Social + Marketing news headlines:

{headlines}

Analyze these headlines and provide:

1. Top Trends
2. Key Insights
3. Content Opportunities
4. Best Topic to Post Today
"""

    try:
        summary = ask_gemini(prompt)
    except Exception as e:
        summary = "AI analysis failed temporarily"


    return {
        "headlines": headlines,
        "analysis": summary
    }

# ==========================================
# IMAGE GENERATION
# ==========================================
@app.post("/generate-image")
def generate_image(data: GenerateImageRequest):

    image_path = "images/demo_ai_banner.png"

    return FileResponse(
        path=image_path,
        media_type="image/png",
        filename="demo_ai_banner.png"
    )
# ==========================================
# SCHEDULE POST
# ==========================================

@app.post("/schedule-post")
def schedule_post(data: SchedulePostRequest,
                  db: Session = Depends(get_db)
):
    db_post = ScheduledPost(
    title=data.title,
    platform=data.platform,
    type=data.type,
    content=data.content,
    date=data.date,
    time=data.time,
    status=data.status
)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)

    return {
        "message": "Post scheduled successfully!",
        "scheduled_post": {
            "id": db_post.id,
            "title": db_post.title,
            "platform": db_post.platform,
            "type": db_post.type,
            "content": db_post.content,
            "date": db_post.date,
            "time": db_post.time,
            "status": db_post.status
}
}
@app.get("/scheduled-posts")
def get_scheduled_posts(
     db: Session = Depends(get_db)
):
    
 posts = db.query(ScheduledPost).all()

 return {
    "scheduled_posts": [
        {
        "id": post.id,
        "title": post.title,
        "platform": post.platform,
        "type": post.type,
        "content": post.content,
        "date": post.date,
        "time": post.time,
        "status": post.status
        }
        for post in posts
    ]
}   


@app.post("/publish-post")
def publish_post(data: PublishPostRequest,
                 db: Session = Depends(get_db)
                 ):

    post = db.query(ScheduledPost).filter(
    ScheduledPost.id == data.post_id
).first()

    if not post:
        return {
        "message": "Post not found!"
    }

    post.status = "Published"

    db.commit()
    db.refresh(post)

    return {
        "message": "Post published successfully!",
        "published_post": {
                "id": post.id,
                "title": post.title,
                "platform": post.platform,
                "type": post.type,
                "content": post.content,
                "date": post.date,
                "time": post.time,
                "status": post.status
}
}

@app.get("/published-posts")
def get_published_posts(
    db: Session = Depends(get_db)
):

    posts = db.query(ScheduledPost).filter(
        ScheduledPost.status == "Published"
    ).all()


    return {
        "published_posts":[

            {
                "id": post.id,
                "title": post.title,
                "platform": post.platform,
                "type": post.type,
                "content": post.content,
                "date": post.date,
                "time": post.time,
                "status": post.status
}
            for post in posts

        ]
    }

# ==========================================
# DASHBOARD
# ==========================================

@app.get("/dashboard")
def dashboard(db: Session = Depends(get_db)):

    posts = db.query(ScheduledPost).all()

    return {
        "backend_status": "Running ✅",
        "total_scheduled_posts": len(posts),
        "scheduled_posts": [
            {
"id": post.id,
"title": post.title,
"platform": post.platform,
"type": post.type,
"content": post.content,
"date": post.date,
"time": post.time,
"status": post.status
}
            for post in posts
        ],
        "message": "Welcome to EchoSocial Dashboard!"
    }

# ==========================================
# ANALYTICS
# ==========================================

@app.get("/analytics")
def analytics(db: Session = Depends(get_db)):

    total_posts = db.query(ScheduledPost).count()

    published_posts = db.query(ScheduledPost).filter(
        ScheduledPost.status == "Published"
    ).count()

    scheduled_posts = db.query(ScheduledPost).filter(
        ScheduledPost.status == "Scheduled"
    ).count()

    success_rate = (
        (published_posts / total_posts) * 100
        if total_posts > 0 else 0
    )

    return {
        "total_posts": total_posts,
        "published_posts": published_posts,
        "scheduled_posts": scheduled_posts,
        "success_rate": success_rate
    }

@app.delete("/clear-scheduled-posts")
def clear_scheduled_posts(db: Session = Depends(get_db)):

    db.query(ScheduledPost).delete()

    db.commit()

    return {
        "message": "All scheduled posts deleted"
    }  