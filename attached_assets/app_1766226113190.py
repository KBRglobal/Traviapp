import streamlit as st
import os
import base64
import json
import time
import re
import threading
import concurrent.futures
import requests
from datetime import datetime
from pathlib import Path
from google import genai
from google.genai import types
from openai import OpenAI
from keywords_database import DUBAI_KEYWORDS, IMAGE_TYPES, get_all_topics, generate_filename, generate_search_tags

AI_INTEGRATIONS_GEMINI_API_KEY = os.environ.get("AI_INTEGRATIONS_GEMINI_API_KEY")
AI_INTEGRATIONS_GEMINI_BASE_URL = os.environ.get("AI_INTEGRATIONS_GEMINI_BASE_URL")
AI_INTEGRATIONS_OPENAI_API_KEY = os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY")
AI_INTEGRATIONS_OPENAI_BASE_URL = os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL")
FREEPIK_API_KEY = os.environ.get("FREEPIK_API_KEY")

gemini_client = genai.Client(
    api_key=AI_INTEGRATIONS_GEMINI_API_KEY,
    http_options={
        'api_version': '',
        'base_url': AI_INTEGRATIONS_GEMINI_BASE_URL   
    }
)

openai_client = OpenAI(
    api_key=AI_INTEGRATIONS_OPENAI_API_KEY,
    base_url=AI_INTEGRATIONS_OPENAI_BASE_URL
)

DATA_DIR = Path("data/library")
DATA_DIR.mkdir(parents=True, exist_ok=True)
INDEX_FILE = DATA_DIR / "index.json"
QUEUE_FILE = DATA_DIR / "queue_state.json"
CUSTOM_TOPICS_FILE = DATA_DIR / "custom_topics.json"

def load_custom_topics():
    if CUSTOM_TOPICS_FILE.exists():
        try:
            with open(CUSTOM_TOPICS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {"topics": []}
    return {"topics": []}

def save_custom_topics(data):
    with open(CUSTOM_TOPICS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

FREEPIK_DOWNLOADS_FILE = DATA_DIR / "freepik_downloads.json"
AI_REVIEWS_FILE = DATA_DIR / "ai_reviews.json"
FREEPIK_QUEUE_FILE = DATA_DIR / "freepik_queue_state.json"
COLLECTIONS_FILE = DATA_DIR / "collections.json"
CAPTIONS_FILE = DATA_DIR / "hebrew_captions.json"

def load_collections():
    if COLLECTIONS_FILE.exists():
        try:
            with open(COLLECTIONS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {"collections": []}
    return {"collections": []}

def save_collections(data):
    with open(COLLECTIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_captions():
    if CAPTIONS_FILE.exists():
        try:
            with open(CAPTIONS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_captions(data):
    with open(CAPTIONS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def generate_hebrew_caption(image_path, topic=""):
    try:
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        prompt = f"""תאר את התמונה הזו בעברית. התמונה קשורה לנושא: {topic}.
צור תיאור קצר ומדויק של 2-3 משפטים בעברית לשימוש כ-alt text וכיתוב לאתר תיירות.
הדגש את האטרקציה, האווירה והחוויה.
החזר רק את התיאור בעברית, ללא הסברים נוספים."""

        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=base64.b64decode(image_data), mime_type="image/jpeg"),
                        types.Part.from_text(text=prompt)
                    ]
                )
            ]
        )
        
        return response.text.strip() if response.text else ""
    except Exception as e:
        return f"שגיאה: {str(e)}"

def translate_hebrew_to_english(hebrew_query):
    try:
        prompt = f"""Translate this Hebrew search query to English keywords for image search.
Hebrew query: {hebrew_query}
Return only the English keywords, no explanation."""
        
        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=[
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=prompt)]
                )
            ]
        )
        
        return response.text.strip() if response.text else hebrew_query
    except Exception as e:
        return hebrew_query

def auto_rate_image(image_path, topic=""):
    try:
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        prompt = f"""Rate this image for Dubai tourism use on a scale of 1-10.
Topic: {topic}
Consider: image quality, relevance to Dubai tourism, visual appeal, professional look.
Return ONLY a single number 1-10, nothing else."""

        response = gemini_client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=base64.b64decode(image_data), mime_type="image/jpeg"),
                        types.Part.from_text(text=prompt)
                    ]
                )
            ]
        )
        
        score_text = response.text.strip() if response.text else "5"
        try:
            score = int(re.search(r'\d+', score_text).group())
            return min(10, max(1, score))
        except:
            return 5
    except:
        return 5

def load_ai_reviews():
    if AI_REVIEWS_FILE.exists():
        try:
            with open(AI_REVIEWS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {"reviews": [], "reviewed_paths": []}
    return {"reviews": [], "reviewed_paths": []}

def save_ai_reviews(data):
    with open(AI_REVIEWS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_freepik_queue():
    if FREEPIK_QUEUE_FILE.exists():
        try:
            with open(FREEPIK_QUEUE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {"running": False, "current_page": 1, "total_downloaded": 0, "errors": 0, "last_run": None}
    return {"running": False, "current_page": 1, "total_downloaded": 0, "errors": 0, "last_run": None}

def save_freepik_queue(data):
    with open(FREEPIK_QUEUE_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_freepik_downloads():
    if FREEPIK_DOWNLOADS_FILE.exists():
        try:
            with open(FREEPIK_DOWNLOADS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {"downloaded_ids": [], "downloads": []}
    return {"downloaded_ids": [], "downloads": []}

def save_freepik_downloads(data):
    with open(FREEPIK_DOWNLOADS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def search_freepik(query, limit=20, page=1):
    if not FREEPIK_API_KEY:
        return None, "מפתח API של Freepik לא הוגדר"
    
    headers = {
        "x-freepik-api-key": FREEPIK_API_KEY,
        "Accept": "application/json"
    }
    
    params = {
        "term": query,
        "limit": limit,
        "page": page,
        "filters[content_type][photo]": "1"
    }
    
    try:
        response = requests.get(
            "https://api.freepik.com/v1/resources",
            headers=headers,
            params=params,
            timeout=30
        )
        
        if response.status_code == 200:
            return response.json(), None
        elif response.status_code == 401:
            return None, "מפתח API לא תקין"
        elif response.status_code == 429:
            return None, "RATE_LIMITED_429"
        else:
            return None, f"שגיאה: {response.status_code}"
    except Exception as e:
        return None, f"שגיאת חיבור: {str(e)}"

def download_freepik_image(resource_id, download_url):
    if not download_url:
        return None, "כתובת הורדה לא תקינה"
    
    try:
        response = requests.get(download_url, timeout=60, stream=True)
        if response.status_code == 200:
            content_type = response.headers.get("content-type", "")
            if "image" in content_type or "zip" in content_type or len(response.content) > 1000:
                return response.content, None
            else:
                return None, "התוכן אינו תמונה"
        else:
            return None, f"שגיאת הורדה: {response.status_code}"
    except Exception as e:
        return None, f"שגיאה: {str(e)}"

def get_freepik_download_url(resource_id):
    if not FREEPIK_API_KEY:
        return None, "מפתח API לא הוגדר"
    
    headers = {
        "x-freepik-api-key": FREEPIK_API_KEY,
        "Accept": "application/json"
    }
    
    try:
        response = requests.get(
            f"https://api.freepik.com/v1/resources/{resource_id}/download",
            headers=headers,
            params={"image_size": "large"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json().get("data", {})
            url = data.get("signed_url") or data.get("url")
            return url, None
        elif response.status_code == 403:
            return None, "אין גישה להורדה - בדוק את הרשיון שלך"
        elif response.status_code == 404:
            return None, "התמונה לא נמצאה"
        else:
            return None, f"שגיאה: {response.status_code}"
    except Exception as e:
        return None, f"שגיאה: {str(e)}"

def save_freepik_to_library(image_bytes, resource_data, topic, category):
    category_dir = DATA_DIR / "freepik" / slugify(topic)
    category_dir.mkdir(parents=True, exist_ok=True)
    
    resource_id = resource_data.get("id", "unknown")
    title = resource_data.get("title", "freepik-image")
    safe_title = slugify(title)[:40]
    filename = f"freepik-{resource_id}-{safe_title}.jpg"
    image_path = category_dir / filename
    
    with open(image_path, 'wb') as f:
        f.write(image_bytes)
    
    tags = [topic.lower(), "freepik", "stock", "dubai"]
    if resource_data.get("tags"):
        tags.extend([t.lower() for t in resource_data.get("tags", [])[:10]])
    
    metadata = {
        "filename": filename,
        "path": str(image_path),
        "category": "freepik",
        "topic": topic,
        "image_type": "stock",
        "keywords": tags[:15],
        "tags": tags[:15],
        "source": "freepik",
        "freepik_id": resource_id,
        "freepik_url": resource_data.get("url", ""),
        "original_title": resource_data.get("title", ""),
        "created_at": datetime.now().isoformat(),
        "searchable_text": f"freepik stock {topic} {' '.join(tags)} dubai tourism".lower()
    }
    
    metadata_path = image_path.with_suffix('.json')
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    return metadata

def analyze_image_quality(image_path):
    try:
        with open(image_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        prompt = """Analyze this image for a Dubai tourism library. Score it 1-10 and explain.

Consider:
1. Is this actually Dubai or UAE related? (If not Dubai, score 1-3)
2. Is it a real photo or AI-generated? (AI artifacts = lower score)
3. Image quality (blur, noise, resolution)
4. Tourism value (would a travel article use this?)
5. Authenticity and realism

Respond in JSON format only:
{
  "score": 7,
  "is_dubai": true,
  "is_ai_generated": false,
  "quality_notes": "Clear photo of Burj Khalifa at sunset",
  "recommendation": "keep" or "review" or "remove"
}"""

        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                {"text": prompt},
                {"inline_data": {"mime_type": "image/jpeg", "data": image_data}}
            ]
        )
        
        if response.text:
            text = response.text.strip()
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0]
            elif "```" in text:
                text = text.split("```")[1].split("```")[0]
            return json.loads(text.strip())
    except Exception as e:
        return {"score": 5, "error": str(e), "recommendation": "review"}

def auto_categorize_image(image_path, title="", tags=None):
    all_topics = get_all_topics()
    
    title_lower = (title or "").lower()
    tags_str = " ".join(tags or []).lower()
    search_text = f"{title_lower} {tags_str}"
    
    best_match = None
    best_score = 0
    
    for topic_item in all_topics:
        topic_name = topic_item["topic"].lower()
        keywords = [k.lower() for k in topic_item.get("keywords", [])]
        
        score = 0
        if topic_name in search_text:
            score += 10
        for kw in keywords:
            if kw in search_text:
                score += 2
        
        if score > best_score:
            best_score = score
            best_match = topic_item
    
    if best_match and best_score >= 4:
        return best_match["topic"], best_match.get("category", "attractions")
    
    return "Dubai General", "attractions"

def bulk_download_dubai_freepik(max_pages=10, images_per_page=50, delay_seconds=2):
    freepik_data = load_freepik_downloads()
    queue_state = load_freepik_queue()
    index = load_index()
    
    total_run_downloaded = 0
    total_run_errors = 0
    start_page = queue_state.get("current_page", 1)
    initial_total = queue_state.get("total_downloaded", 0)
    
    for page in range(start_page, start_page + max_pages):
        results, error = search_freepik("Dubai", limit=images_per_page, page=page)
        
        if error:
            total_run_errors += 1
            if "RATE_LIMITED" in str(error) or "429" in str(error):
                queue_state["current_page"] = page
                queue_state["total_downloaded"] = initial_total + total_run_downloaded
                queue_state["errors"] = queue_state.get("errors", 0) + total_run_errors
                queue_state["last_run"] = datetime.now().isoformat()
                save_freepik_queue(queue_state)
                save_index(index)
                save_freepik_downloads(freepik_data)
                return total_run_downloaded, total_run_errors, "rate_limited"
            continue
        
        if not results or not results.get("data"):
            break
        
        for resource in results["data"]:
            resource_id = str(resource.get("id", ""))
            
            if resource_id in freepik_data.get("downloaded_ids", []):
                continue
            if resource_id in freepik_data.get("deleted_ids", []):
                continue
            
            download_url, err = get_freepik_download_url(resource_id)
            if err or not download_url:
                total_run_errors += 1
                continue
            
            img_bytes, err = download_freepik_image(resource_id, download_url)
            if err or not img_bytes:
                total_run_errors += 1
                continue
            
            title = resource.get("title", "")
            res_tags = resource.get("tags", [])
            topic, category = auto_categorize_image(None, title, res_tags)
            
            metadata = save_freepik_to_library(img_bytes, resource, topic, category)
            metadata["auto_category"] = category
            metadata["auto_topic"] = topic
            index["images"].append(metadata)
            
            freepik_data["downloaded_ids"].append(resource_id)
            freepik_data["downloads"].append({
                "id": resource_id,
                "topic": topic,
                "category": category,
                "title": title,
                "downloaded_at": datetime.now().isoformat()
            })
            
            total_run_downloaded += 1
            time.sleep(delay_seconds)
        
        queue_state["current_page"] = page + 1
        queue_state["total_downloaded"] = initial_total + total_run_downloaded
        queue_state["last_run"] = datetime.now().isoformat()
        save_freepik_queue(queue_state)
        save_index(index)
        save_freepik_downloads(freepik_data)
    
    queue_state["errors"] = queue_state.get("errors", 0) + total_run_errors
    save_freepik_queue(queue_state)
    return total_run_downloaded, total_run_errors, "completed"

st.set_page_config(
    page_title="מנוע תמונות דובאי - Freepik פרטי",
    page_icon="🎨",
    layout="wide"
)

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text[:50]

def load_index():
    if INDEX_FILE.exists():
        try:
            with open(INDEX_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {"images": [], "stats": {"total": 0, "by_category": {}}}
    return {"images": [], "stats": {"total": 0, "by_category": {}}}

def save_index(index):
    index["stats"]["total"] = len(index["images"])
    index["stats"]["by_category"] = {}
    for img in index["images"]:
        cat = img.get("category", "unknown")
        index["stats"]["by_category"][cat] = index["stats"]["by_category"].get(cat, 0) + 1
    with open(INDEX_FILE, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

def load_queue_state():
    if QUEUE_FILE.exists():
        try:
            with open(QUEUE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {"current_topic_idx": 0, "current_image_idx": 0, "running": False, "completed_topics": []}
    return {"current_topic_idx": 0, "current_image_idx": 0, "running": False, "completed_topics": []}

def save_queue_state(state):
    with open(QUEUE_FILE, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

def save_image_to_library(category, topic, image_type, image_bytes, prompt, keywords, source_provider="unknown"):
    category_dir = DATA_DIR / category / slugify(topic)
    category_dir.mkdir(parents=True, exist_ok=True)
    
    filename = generate_filename(category, topic, image_type, keywords)
    image_path = category_dir / filename
    
    counter = 1
    while image_path.exists():
        base_name = filename.rsplit('.', 1)[0]
        image_path = category_dir / f"{base_name}-{counter}.jpg"
        counter += 1
    
    with open(image_path, 'wb') as f:
        f.write(image_bytes)
    
    tags = generate_search_tags(category, topic, keywords, image_type)
    
    metadata = {
        "filename": image_path.name,
        "path": str(image_path),
        "category": category,
        "topic": topic,
        "image_type": image_type["type"],
        "keywords": keywords,
        "tags": tags,
        "prompt": prompt,
        "created_at": datetime.now().isoformat(),
        "searchable_text": f"{category} {topic} {' '.join(keywords)} {image_type['type']} dubai tourism".lower(),
        "source": "ai_generated",
        "source_provider": source_provider
    }
    
    metadata_path = image_path.with_suffix('.json')
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    return metadata

def generate_with_gemini(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = gemini_client.models.generate_content(
                model="gemini-2.5-flash-image",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_modalities=["TEXT", "IMAGE"]
                )
            )
            
            if response.candidates:
                candidate = response.candidates[0]
                if candidate.content and candidate.content.parts:
                    for part in candidate.content.parts:
                        if hasattr(part, 'inline_data') and part.inline_data:
                            image_data = part.inline_data.data
                            if isinstance(image_data, bytes):
                                return ("gemini", image_data)
                            else:
                                return ("gemini", base64.b64decode(image_data))
            return None
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "rate" in error_msg.lower():
                wait_time = (2 ** attempt) * 5
                time.sleep(wait_time)
                continue
            elif "FREE_CLOUD_BUDGET_EXCEEDED" in error_msg:
                raise Exception("FREE_CLOUD_BUDGET_EXCEEDED")
            else:
                if attempt == max_retries - 1:
                    raise e
                time.sleep(2)
    return None

def generate_with_openai(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = openai_client.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                n=1,
                size="1024x1024"
            )
            
            if response.data and len(response.data) > 0:
                image_data = response.data[0]
                if hasattr(image_data, 'b64_json') and image_data.b64_json:
                    return ("openai", base64.b64decode(image_data.b64_json))
                elif hasattr(image_data, 'url') and image_data.url:
                    img_response = requests.get(image_data.url)
                    if img_response.status_code == 200:
                        return ("openai", img_response.content)
            return None
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "rate" in error_msg.lower():
                wait_time = (2 ** attempt) * 5
                time.sleep(wait_time)
                continue
            elif "FREE_CLOUD_BUDGET_EXCEEDED" in error_msg:
                raise Exception("FREE_CLOUD_BUDGET_EXCEEDED")
            else:
                if attempt == max_retries - 1:
                    raise e
                time.sleep(2)
    return None

def generate_parallel(prompt1, prompt2):
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        future_gemini = executor.submit(generate_with_gemini, prompt1)
        future_openai = executor.submit(generate_with_openai, prompt2)
        
        for future in concurrent.futures.as_completed([future_gemini, future_openai]):
            try:
                result = future.result()
                if result:
                    results.append(result)
            except Exception as e:
                if "FREE_CLOUD_BUDGET_EXCEEDED" in str(e):
                    raise e
    return results

STYLE_VARIATIONS = [
    {"name": "realistic", "prompt": "Photorealistic, high resolution, professional DSLR photography, sharp details"},
    {"name": "cinematic", "prompt": "Cinematic look, dramatic lighting, movie still, widescreen composition"},
    {"name": "editorial", "prompt": "Editorial style, magazine quality, vibrant colors, lifestyle photography"},
    {"name": "architectural", "prompt": "Architectural photography, clean lines, symmetrical, professional real estate"},
    {"name": "vibrant", "prompt": "Vibrant colors, high saturation, travel brochure style, eye-catching"},
]

PROMPT_HISTORY_FILE = DATA_DIR / "prompt_history.json"
RATINGS_FILE = DATA_DIR / "image_ratings.json"

def load_prompt_history():
    if PROMPT_HISTORY_FILE.exists():
        try:
            with open(PROMPT_HISTORY_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {"prompts": [], "successful": []}
    return {"prompts": [], "successful": []}

def save_prompt_history(history):
    with open(PROMPT_HISTORY_FILE, 'w', encoding='utf-8') as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

def load_ratings():
    if RATINGS_FILE.exists():
        try:
            with open(RATINGS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_ratings(ratings):
    with open(RATINGS_FILE, 'w', encoding='utf-8') as f:
        json.dump(ratings, f, ensure_ascii=False, indent=2)

def research_and_enhance_prompt(topic, category, image_type):
    """Use AI to research how the place really looks and create an accurate prompt"""
    try:
        research_query = f"""You are a visual research expert for Dubai tourism photography. 
Research and describe how "{topic}" in Dubai actually looks in real life.

Provide a detailed visual description including:
1. ARCHITECTURE: Building style, shape, materials, colors, distinctive features
2. SURROUNDINGS: What's around it, landscape, other buildings, water, desert
3. COLORS: Dominant color palette, lighting conditions at different times
4. UNIQUE DETAILS: Specific recognizable elements, textures, decorations
5. SCALE: How big/tall, compared to surroundings
6. ATMOSPHERE: The feeling, vibe, typical crowd/activity

Be VERY specific and accurate. This will be used to generate realistic images.
Return only the visual description, no explanations."""

        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=research_query
        )
        
        research_result = response.text.strip()
        
        enhanced_prompt = f"""Single high-quality photograph of {topic} in Dubai.

ACCURATE VISUAL REFERENCE:
{research_result}

PHOTOGRAPHY STYLE: {image_type.get('prompt', 'Professional tourism photography')}

REQUIREMENTS:
- One single image only, absolutely no collage, no grid, no multiple views
- Photorealistic and accurate to how {topic} actually looks
- Professional tourism/travel photography quality
- High resolution, sharp details"""

        history = load_prompt_history()
        history["prompts"].append({
            "topic": topic,
            "category": category,
            "research": research_result[:500],
            "enhanced_prompt": enhanced_prompt[:1000],
            "created_at": datetime.now().isoformat()
        })
        if len(history["prompts"]) > 100:
            history["prompts"] = history["prompts"][-100:]
        save_prompt_history(history)
        
        return enhanced_prompt, research_result
        
    except Exception as e:
        basic_prompt = f"Single high-quality photograph of {topic} in Dubai. {image_type.get('prompt', '')}. One image only, no collage. Professional tourism photography."
        return basic_prompt, f"Research failed: {e}"

def generate_seo_metadata(topic, category, image_type, research_result=""):
    """Generate SEO-optimized metadata for an image"""
    try:
        seo_query = f"""Generate SEO metadata for a Dubai tourism image of "{topic}".
Category: {category}
Image type: {image_type.get('type', 'general')}
Visual description: {research_result[:500] if research_result else 'Professional tourism photo'}

Return JSON only (no markdown):
{{"alt_text": "125-150 char descriptive alt text with keywords",
"caption": "Engaging caption for social media, 2-3 sentences",
"title": "SEO optimized title",
"keywords": ["keyword1", "keyword2", ...],
"schema_description": "Description for schema.org markup"}}"""

        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=seo_query
        )
        
        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        
        return json.loads(response_text)
    except:
        return {
            "alt_text": f"{topic} in Dubai - professional tourism photography",
            "caption": f"Discover {topic} in Dubai. A must-visit destination for travelers.",
            "title": f"{topic} Dubai - Travel Photo",
            "keywords": [topic.lower(), "dubai", "tourism", "travel", category],
            "schema_description": f"Professional photograph of {topic} in Dubai for tourism."
        }

def generate_with_research(topic, category, image_type, use_research=True):
    """Generate image with enhanced prompt from research"""
    if use_research:
        enhanced_prompt, research = research_and_enhance_prompt(topic, category, image_type)
    else:
        enhanced_prompt = f"Single high-quality photograph of {topic} in Dubai. {image_type.get('prompt', '')}. One image only, no collage."
        research = ""
    
    result = generate_with_gemini(enhanced_prompt)
    
    if result:
        provider, img_bytes = result
        seo_metadata = generate_seo_metadata(topic, category, image_type, research)
        return img_bytes, enhanced_prompt, research, seo_metadata
    
    return None, enhanced_prompt, research, {}

def generate_multi_parallel(base_prompt, topic, num_variations=4):
    results = []
    futures = []
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=num_variations) as executor:
        for i in range(num_variations):
            style = STYLE_VARIATIONS[i % len(STYLE_VARIATIONS)]
            
            if i % 2 == 0:
                full_prompt = f"Single photograph of {topic} in Dubai. {base_prompt}. {style['prompt']}. One image only, no collage."
                futures.append((executor.submit(generate_with_gemini, full_prompt), "gemini", style["name"]))
            else:
                full_prompt = f"One single photograph showing {topic} in Dubai. {base_prompt}. {style['prompt']}. No collage, single image only."
                futures.append((executor.submit(generate_with_openai, full_prompt), "openai", style["name"]))
        
        for future, provider_hint, style_name in futures:
            try:
                result = future.result()
                if result:
                    provider, img_bytes = result
                    results.append((provider, style_name, img_bytes))
            except Exception as e:
                if "FREE_CLOUD_BUDGET_EXCEEDED" in str(e):
                    raise e
    
    return results

def generate_single_image(prompt, provider="gemini", max_retries=3):
    if provider == "openai":
        result = generate_with_openai(prompt, max_retries)
        return result[1] if result else None
    else:
        result = generate_with_gemini(prompt, max_retries)
        return result[1] if result else None

def import_old_generated_images():
    """Import images from data/generated/ folder to the new library system"""
    old_dir = Path("data/generated")
    if not old_dir.exists():
        return 0
    
    index = load_index()
    existing_paths = set(img.get("path", "") for img in index["images"])
    imported = 0
    
    for topic_dir in old_dir.iterdir():
        if not topic_dir.is_dir():
            continue
        
        topic_name = topic_dir.name.replace("-", " ").title()[:50]
        
        for img_file in topic_dir.glob("*.jpg"):
            str_path = str(img_file)
            if str_path in existing_paths:
                continue
            
            metadata_file = img_file.with_suffix('.json')
            if metadata_file.exists():
                try:
                    with open(metadata_file, 'r', encoding='utf-8') as f:
                        old_meta = json.load(f)
                except:
                    old_meta = {}
            else:
                old_meta = {}
            
            metadata = {
                "filename": img_file.name,
                "path": str_path,
                "category": "imported",
                "topic": topic_name,
                "image_type": old_meta.get("image_type", "general"),
                "keywords": old_meta.get("keywords", topic_name.lower().split()),
                "tags": ["imported", "dubai", "tourism"] + topic_name.lower().split()[:3],
                "prompt": old_meta.get("prompt", ""),
                "created_at": old_meta.get("created_at", datetime.now().isoformat()),
                "searchable_text": f"imported {topic_name} dubai tourism {old_meta.get('prompt', '')}".lower()
            }
            
            index["images"].append(metadata)
            imported += 1
    
    if imported > 0:
        save_index(index)
    
    return imported

def get_all_library_images():
    """Get all images from both library and generated folders"""
    all_images = []
    
    index = load_index()
    all_images.extend(index["images"])
    
    old_dir = Path("data/generated")
    if old_dir.exists():
        existing_paths = set(img.get("path", "") for img in all_images)
        for topic_dir in old_dir.iterdir():
            if not topic_dir.is_dir():
                continue
            topic_name = topic_dir.name.replace("-", " ").title()[:50]
            for img_file in topic_dir.glob("*.jpg"):
                if str(img_file) not in existing_paths:
                    all_images.append({
                        "filename": img_file.name,
                        "path": str(img_file),
                        "category": "generated-old",
                        "topic": topic_name,
                        "tags": ["dubai", "tourism", "generated"]
                    })
    
    return all_images

def search_library(query, category_filter=None, image_type_filter=None):
    index = load_index()
    results = []
    query_lower = query.lower()
    query_terms = query_lower.split()
    
    for img in index["images"]:
        if category_filter and img.get("category") != category_filter:
            continue
        if image_type_filter and img.get("image_type") != image_type_filter:
            continue
        
        searchable = img.get("searchable_text", "")
        tags = img.get("tags", [])
        
        score = 0
        for term in query_terms:
            if term in searchable:
                score += 1
            if term in tags:
                score += 2
        
        if score > 0:
            results.append((score, img))
    
    results.sort(key=lambda x: x[0], reverse=True)
    return [r[1] for r in results]

if 'autopilot_running' not in st.session_state:
    st.session_state.autopilot_running = False
if 'autopilot_log' not in st.session_state:
    st.session_state.autopilot_log = []

st.title("🎨 מאגר תמונות דובאי - Freepik פרטי")
st.markdown("מערכת יצירת תמונות אוטומטית עם שמות קבצים חכמים לחיפוש מהיר")

tab1, tab2, tab3, tab4, tab5, tab6, tab7, tab8, tab9, tab10, tab11, tab12 = st.tabs(["🔍 חיפוש מאגר", "🤖 אוטופיילוט", "📊 סטטיסטיקות", "🖼️ יצירה ידנית", "📝 ניתוח מאמר", "👹 מצב מפלצת", "📋 עורך נושאים", "📦 ייבוא Freepik", "🔬 סוכן איכות", "📁 קולקציות", "⚔️ השוואה", "📦 ייצוא ZIP"])

def get_source_badge(img):
    source = img.get("source", "unknown")
    provider = img.get("source_provider", img.get("provider", ""))
    
    if source == "freepik" or "freepik" in img.get("path", "").lower():
        return "🟢 Freepik", "freepik"
    elif provider == "gemini":
        return "🔵 Gemini AI", "gemini"
    elif provider == "openai":
        return "🟣 OpenAI", "openai"
    elif source == "ai_generated":
        return "🤖 AI", "ai"
    else:
        return "📷 מקור לא ידוע", "unknown"

def sort_images_freepik_first(images):
    freepik = []
    gemini = []
    openai = []
    other = []
    
    for img in images:
        source = img.get("source", "")
        provider = img.get("source_provider", img.get("provider", ""))
        path = img.get("path", "").lower()
        
        if source == "freepik" or "freepik" in path:
            freepik.append(img)
        elif provider == "gemini":
            gemini.append(img)
        elif provider == "openai":
            openai.append(img)
        else:
            other.append(img)
    
    return freepik + gemini + openai + other

def delete_image_from_library(img_path):
    index = load_index()
    path_str = str(img_path)
    
    deleted_img = None
    for img in index["images"]:
        if img.get("path") == path_str:
            deleted_img = img
            break
    
    index["images"] = [i for i in index["images"] if i.get("path") != path_str]
    save_index(index)
    
    if deleted_img and deleted_img.get("source") == "freepik":
        freepik_id = deleted_img.get("freepik_id", "")
        if freepik_id:
            freepik_data = load_freepik_downloads()
            if freepik_id in freepik_data.get("downloaded_ids", []):
                freepik_data["downloaded_ids"].remove(freepik_id)
            freepik_data["downloads"] = [d for d in freepik_data.get("downloads", []) if d.get("id") != freepik_id]
            freepik_data.setdefault("deleted_ids", []).append(freepik_id)
            save_freepik_downloads(freepik_data)
    
    try:
        img_file = Path(img_path)
        if img_file.exists():
            img_file.unlink()
        json_file = img_file.with_suffix('.json')
        if json_file.exists():
            json_file.unlink()
        return True
    except:
        return False

def get_ai_review_score(path_str, ai_reviews):
    reviews_list = ai_reviews.get("reviews", [])
    if isinstance(reviews_list, dict):
        return reviews_list.get(path_str, {}).get("score", 0)
    for review in reviews_list:
        if review.get("path") == path_str:
            return review.get("score", 0)
    return 0

with tab1:
    st.markdown("## 📚 ארכיון תמונות דובאי")
    st.markdown("מאגר תמונות עם מידע על המקור, דירוג, ולייק/דיסלייק")
    
    all_images = get_all_library_images()
    ratings = load_ratings()
    ai_reviews = load_ai_reviews()
    
    freepik_count = len([i for i in all_images if i.get("source") == "freepik" or "freepik" in i.get("path", "").lower()])
    ai_count = len([i for i in all_images if i.get("source") == "ai_generated"])
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("סה\"כ תמונות", len(all_images))
    with col2:
        st.metric("🟢 Freepik", freepik_count)
    with col3:
        st.metric("🤖 AI Generated", ai_count)
    with col4:
        liked = len([p for p, r in ratings.items() if r == "like"])
        st.metric("👍 לייקים", liked)
    
    st.markdown("---")
    
    col1, col2, col3, col4 = st.columns([3, 1, 1, 1])
    with col1:
        search_query = st.text_input("🔍 חיפוש (עברית או אנגלית)", placeholder="ברג' כליפה, burj khalifa sunset...", key="archive_search")
    with col2:
        source_filter = st.selectbox("מקור", ["הכל", "🟢 Freepik", "🔵 Gemini", "🟣 OpenAI"], key="source_filter")
    with col3:
        category_options = ["הכל"] + list(DUBAI_KEYWORDS.keys()) + ["freepik"]
        selected_category = st.selectbox("קטגוריה", category_options, key="cat_filter")
    with col4:
        sort_option = st.selectbox("מיון", ["Freepik ראשון", "חדש ראשון", "ציון גבוה"], key="sort_option")
    
    filtered_images = all_images
    
    if search_query:
        actual_query = search_query
        if any('\u0590' <= c <= '\u05FF' for c in search_query):
            with st.spinner("מתרגם חיפוש עברי לאנגלית..."):
                actual_query = translate_hebrew_to_english(search_query)
                st.caption(f"🌐 חיפוש: {actual_query}")
        cat_filter = None if selected_category == "הכל" else selected_category
        filtered_images = search_library(actual_query, cat_filter, None)
        filtered_images = sort_images_freepik_first(filtered_images)
    elif selected_category != "הכל":
        filtered_images = [i for i in all_images if i.get("category") == selected_category]
        filtered_images = sort_images_freepik_first(filtered_images)
    
    if source_filter == "🟢 Freepik":
        filtered_images = [i for i in filtered_images if i.get("source") == "freepik" or "freepik" in i.get("path", "").lower()]
    elif source_filter == "🔵 Gemini":
        filtered_images = [i for i in filtered_images if i.get("source_provider", i.get("provider", "")) == "gemini"]
    elif source_filter == "🟣 OpenAI":
        filtered_images = [i for i in filtered_images if i.get("source_provider", i.get("provider", "")) == "openai"]
    
    if sort_option == "Freepik ראשון":
        filtered_images = sort_images_freepik_first(filtered_images)
    elif sort_option == "חדש ראשון":
        filtered_images = sorted(filtered_images, key=lambda x: x.get("created_at", ""), reverse=True)
    elif sort_option == "ציון גבוה":
        filtered_images = sorted(filtered_images, key=lambda img: get_ai_review_score(img.get("path", ""), ai_reviews), reverse=True)
    
    st.info(f"📊 מציג {len(filtered_images)} תמונות (Freepik מקבלות עדיפות)")
    
    page_size = 20
    total_pages = max(1, (len(filtered_images) + page_size - 1) // page_size)
    if 'archive_page' not in st.session_state:
        st.session_state.archive_page = 0
    
    col1, col2, col3 = st.columns([1, 3, 1])
    with col1:
        if st.button("◀️ הקודם", disabled=st.session_state.archive_page == 0):
            st.session_state.archive_page -= 1
            st.rerun()
    with col2:
        st.markdown(f"<center>עמוד {st.session_state.archive_page + 1} מתוך {total_pages}</center>", unsafe_allow_html=True)
    with col3:
        if st.button("הבא ▶️", disabled=st.session_state.archive_page >= total_pages - 1):
            st.session_state.archive_page += 1
            st.rerun()
    
    start_idx = st.session_state.archive_page * page_size
    page_images = filtered_images[start_idx:start_idx + page_size]
    
    captions = load_captions()
    
    if page_images:
        cols = st.columns(4)
        for idx, img in enumerate(page_images):
            with cols[idx % 4]:
                img_path = Path(img["path"])
                if img_path.exists():
                    with open(img_path, 'rb') as f:
                        img_data = f.read()
                        st.image(img_data, use_container_width=True)
                    
                    badge, source_type = get_source_badge(img)
                    
                    path_str = str(img_path)
                    ai_score = ""
                    score = get_ai_review_score(path_str, ai_reviews)
                    if score > 0:
                        ai_score = f" | ⭐ {score}/10"
                    
                    st.markdown(f"**{badge}**{ai_score}")
                    st.caption(f"📁 {img['filename'][:30]}")
                    st.caption(f"📂 {img.get('topic', img.get('category', 'N/A'))[:20]}")
                    
                    btn_col1, btn_col2, btn_col3, btn_col4 = st.columns(4)
                    unique_key = f"{start_idx}_{idx}"
                    
                    current_rating = ratings.get(path_str, "")
                    
                    with btn_col1:
                        like_style = "primary" if current_rating == "like" else "secondary"
                        if st.button("👍", key=f"like_{unique_key}", type=like_style):
                            ratings[path_str] = "like"
                            save_ratings(ratings)
                            st.rerun()
                    
                    with btn_col2:
                        if st.button("👎", key=f"dislike_{unique_key}", type="secondary"):
                            if delete_image_from_library(img_path):
                                if path_str in ratings:
                                    del ratings[path_str]
                                    save_ratings(ratings)
                                st.success("נמחק!")
                                st.rerun()
                    
                    with btn_col3:
                        st.download_button("📥", img_data, img['filename'], "image/jpeg", key=f"dl_{unique_key}")
                    
                    with btn_col4:
                        if st.button("✏️", key=f"cap_{unique_key}", help="יצירת כיתוב עברי"):
                            with st.spinner("יוצר כיתוב..."):
                                caption = generate_hebrew_caption(str(img_path), img.get("topic", ""))
                                captions[path_str] = {"caption": caption, "created_at": datetime.now().isoformat()}
                                save_captions(captions)
                                st.success("נוצר כיתוב!")
                                st.rerun()
                    
                    if path_str in captions:
                        st.info(f"📝 {captions[path_str].get('caption', '')[:80]}...")
    else:
        st.info("לא נמצאו תמונות. הפעל את האוטופיילוט או ייבא מ-Freepik.")

def count_images_per_topic(index):
    """Count how many images exist for each topic"""
    counts = {}
    for img in index.get("images", []):
        topic = img.get("topic", "unknown")
        counts[topic] = counts.get(topic, 0) + 1
    return counts

with tab2:
    st.markdown("## 🤖 אוטופיילוט טורבו - יצירה מקבילית מרובה")
    st.markdown("**Gemini** ו-**OpenAI** עובדים במקביל עם 5 סגנונות שונים - עד 4 תמונות בו-זמנית!")
    st.markdown("🎯 **יעד: 100 תמונות לכל נושא** - הנושא יושלם אוטומטית כשהמטרה מושגת")
    
    queue_state = load_queue_state()
    custom_topics_data = load_custom_topics()
    all_topics = get_all_topics() + custom_topics_data.get("topics", [])
    index = load_index()
    topic_counts = count_images_per_topic(index)
    
    completed_100 = [t for t, c in topic_counts.items() if c >= 100]
    in_progress = [t for t, c in topic_counts.items() if 0 < c < 100]
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("נושאים במסד", len(all_topics))
        st.metric("נושאים שהגיעו ל-100", len(completed_100))
    with col2:
        st.metric("תמונות במאגר", index["stats"]["total"])
        remaining = len(all_topics) - len(completed_100)
        st.metric("נושאים שנותרו", remaining)
    with col3:
        st.metric("🟢 Gemini", "פעיל")
        st.metric("🟢 OpenAI", "פעיל")
    
    st.markdown("### 🎨 סגנונות זמינים")
    style_cols = st.columns(5)
    for i, style in enumerate(STYLE_VARIATIONS):
        with style_cols[i]:
            st.write(f"**{style['name'].title()}**")
    
    st.markdown("---")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        target_per_topic = st.slider("יעד תמונות לכל נושא", 10, 100, 100, 10)
    with col2:
        parallel_count = st.slider("תמונות במקביל בכל סבב", 2, 4, 4)
    with col3:
        delay_between = st.slider("השהייה בין סבבים (שניות)", 2, 10, 3)
    with col4:
        max_topics = st.number_input("מקסימום נושאים להפעלה", min_value=1, max_value=200, value=50)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        start_autopilot = st.button("🚀 הפעל אוטופיילוט", type="primary", use_container_width=True)
    with col2:
        if st.button("⏸️ עצור", use_container_width=True):
            st.session_state.autopilot_running = False
            st.warning("האוטופיילוט יעצור אחרי התמונה הנוכחית")
    with col3:
        if st.button("🔄 איפוס תור", use_container_width=True):
            save_queue_state({"current_topic_idx": 0, "current_image_idx": 0, "running": False, "completed_topics": []})
            st.success("התור אופס")
            st.rerun()
    
    if start_autopilot:
        st.session_state.autopilot_running = True
        st.session_state.autopilot_log = []
        
        index = load_index()
        topic_counts = count_images_per_topic(index)
        completed_topics_list = queue_state.get("completed_topics", [])
        
        topics_to_process = [
            t for t in all_topics 
            if topic_counts.get(t["topic"], 0) < target_per_topic 
            and t["topic"] not in completed_topics_list
        ][:max_topics]
        
        if not topics_to_process:
            st.success(f"כל הנושאים הגיעו ל-{target_per_topic} תמונות! שנה את היעד או הוסף נושאים חדשים.")
        else:
            progress_container = st.container()
            log_container = st.container()
            
            images_created = 0
            topics_completed = 0
            
            overall_progress = st.progress(0, text="מתחיל אוטופיילוט טורבו...")
            
            for topic_idx, topic_data in enumerate(topics_to_process):
                if not st.session_state.autopilot_running:
                    st.warning("האוטופיילוט נעצר")
                    break
                
                topic = topic_data["topic"]
                category = topic_data["category"]
                keywords = topic_data["keywords"]
                
                current_count = topic_counts.get(topic, 0)
                needed = target_per_topic - current_count
                
                with progress_container:
                    st.markdown(f"### 📍 נושא {topic_idx + 1}/{len(topics_to_process)}: {topic}")
                    st.write(f"📊 קיימות: {current_count} | יעד: {target_per_topic} | נדרשות: {needed}")
                    topic_progress = st.progress(current_count / target_per_topic)
                
                round_idx = 0
                while current_count < target_per_topic and st.session_state.autopilot_running:
                    image_type = IMAGE_TYPES[round_idx % len(IMAGE_TYPES)]
                    base_prompt = image_type['prompt']
                    
                    remaining_needed = target_per_topic - current_count
                    batch_size = min(parallel_count, remaining_needed)
                    
                    with log_container:
                        st.write(f"⏳ יוצר {batch_size} תמונות במקביל - {topic} ({current_count}/{target_per_topic})")
                    
                    try:
                        results = generate_multi_parallel(base_prompt, topic, batch_size)
                        
                        for provider, style_name, img_bytes in results:
                            style_type = {"type": style_name, "suffix": f"{image_type['suffix']}-{style_name}", "prompt": base_prompt}
                            
                            metadata = save_image_to_library(
                                category, topic, style_type,
                                img_bytes, f"{topic} - {style_name}", 
                                keywords, source_provider=provider
                            )
                            metadata["provider"] = provider
                            metadata["style"] = style_name
                            index["images"].append(metadata)
                            save_index(index)
                            images_created += 1
                            current_count += 1
                            topic_counts[topic] = current_count
                            
                            with log_container:
                                st.success(f"✅ [{provider.upper()}] [{style_name}] {metadata['filename']} ({current_count}/{target_per_topic})")
                        
                        if not results:
                            with log_container:
                                st.warning(f"⚠️ לא נוצרו תמונות בסבב זה")
                        
                    except Exception as e:
                        if "FREE_CLOUD_BUDGET_EXCEEDED" in str(e):
                            st.error("🛑 תקציב הענן הסתיים. עצירה.")
                            st.session_state.autopilot_running = False
                            break
                        else:
                            with log_container:
                                st.error(f"❌ שגיאה: {e}")
                    
                    topic_progress.progress(min(current_count / target_per_topic, 1.0))
                    overall_progress.progress((topic_idx + 1) / len(topics_to_process), text=f"נושא {topic_idx + 1}/{len(topics_to_process)} | {images_created} תמונות")
                    
                    round_idx += 1
                    time.sleep(delay_between)
                
                if current_count >= target_per_topic:
                    topics_completed += 1
                    completed_topics = queue_state.get("completed_topics", [])
                    if topic not in completed_topics:
                        completed_topics.append(topic)
                    queue_state["completed_topics"] = completed_topics
                    save_queue_state(queue_state)
                    
                    with progress_container:
                        st.success(f"🎯 הושלם! {topic} הגיע ל-{target_per_topic} תמונות")
            
            st.session_state.autopilot_running = False
            st.success(f"🎉 אוטופיילוט הושלם! נוצרו {images_created} תמונות | {topics_completed} נושאים הגיעו ליעד")
            st.balloons()

with tab3:
    st.markdown("## 📊 סטטיסטיקות המאגר")
    
    index = load_index()
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("סה\"כ תמונות", index["stats"]["total"])
    with col2:
        st.metric("קטגוריות", len(index["stats"].get("by_category", {})))
    with col3:
        all_topics_set = set(img.get("topic", "") for img in index["images"])
        st.metric("נושאים ייחודיים", len(all_topics_set))
    
    st.markdown("---")
    st.markdown("### 📁 תמונות לפי קטגוריה")
    
    by_category = index["stats"].get("by_category", {})
    if by_category:
        for cat, count in sorted(by_category.items(), key=lambda x: x[1], reverse=True):
            cat_name = DUBAI_KEYWORDS.get(cat, {}).get("name", cat)
            st.progress(count / max(by_category.values()), text=f"{cat_name}: {count} תמונות")
    else:
        st.info("אין עדיין תמונות במאגר")
    
    st.markdown("---")
    st.markdown("### 🗂️ מבנה התיקיות")
    
    for category_key, category_data in DUBAI_KEYWORDS.items():
        category_dir = DATA_DIR / category_key
        if category_dir.exists():
            topics_in_dir = list(category_dir.iterdir())
            with st.expander(f"📁 {category_data['name']} ({len(topics_in_dir)} נושאים)"):
                for topic_dir in topics_in_dir[:10]:
                    if topic_dir.is_dir():
                        images = list(topic_dir.glob("*.jpg"))
                        st.write(f"  📂 {topic_dir.name}: {len(images)} תמונות")

with tab4:
    st.markdown("## 🖼️ יצירת תמונה ידנית")
    
    col1, col2 = st.columns(2)
    with col1:
        selected_cat = st.selectbox("קטגוריה", list(DUBAI_KEYWORDS.keys()), 
                                     format_func=lambda x: DUBAI_KEYWORDS[x]["name"])
    with col2:
        topics_list = [t["topic"] for t in DUBAI_KEYWORDS[selected_cat]["topics"]]
        selected_topic = st.selectbox("נושא", topics_list)
    
    selected_image_type = st.selectbox("סוג תמונה", IMAGE_TYPES, 
                                        format_func=lambda x: f"{x['type']} - {x['suffix']}")
    
    custom_prompt = st.text_area("תיאור נוסף (אופציונלי)", placeholder="הוסף פרטים נוספים...")
    
    if st.button("✨ צור תמונה", type="primary", use_container_width=True):
        topic_data = next(t for t in DUBAI_KEYWORDS[selected_cat]["topics"] if t["topic"] == selected_topic)
        
        full_prompt = f"{selected_topic}, Dubai. {selected_image_type['prompt']}. {custom_prompt}. Professional tourism photography."
        
        with st.spinner("יוצר תמונה..."):
            try:
                image_bytes = generate_single_image(full_prompt)
                
                if image_bytes:
                    st.image(image_bytes, use_container_width=True)
                    
                    if st.button("💾 שמור למאגר"):
                        metadata = save_image_to_library(
                            selected_cat, selected_topic, selected_image_type,
                            image_bytes, full_prompt, topic_data["keywords"]
                        )
                        
                        index = load_index()
                        index["images"].append(metadata)
                        save_index(index)
                        
                        st.success(f"נשמר: {metadata['filename']}")
                    
                    filename = generate_filename(selected_cat, selected_topic, selected_image_type, topic_data["keywords"])
                    st.download_button("📥 הורד", image_bytes, filename, "image/jpeg")
                else:
                    st.error("לא הצלחתי ליצור תמונה")
            except Exception as e:
                if "FREE_CLOUD_BUDGET_EXCEEDED" in str(e):
                    st.error("תקציב הענן הסתיים")
                else:
                    st.error(f"שגיאה: {e}")

with tab5:
    st.markdown("## 📝 ניתוח מאמר ויצירת תמונות")
    st.markdown("הדבק מאמר והמערכת תנתח, תמליץ ותייצר תמונות אוטומטית")
    
    article_text = st.text_area("הדבק את המאמר כאן", placeholder="הדבק מאמר תיירות על דובאי...", height=250)
    
    col1, col2 = st.columns(2)
    with col1:
        num_images = st.slider("כמות תמונות ליצירה", 3, 8, 5)
    with col2:
        use_parallel_gen = st.checkbox("🚀 יצירה מקבילית (Gemini + OpenAI)", value=True)
    
    if st.button("🎨 נתח וצור תמונות", type="primary", use_container_width=True):
        if article_text and len(article_text) > 100:
            with st.spinner("מנתח את המאמר..."):
                try:
                    analysis_prompt = f"""Analyze this Dubai travel article and recommend exactly {num_images} strategic images.
Return ONLY a JSON array with this exact format (no markdown, no explanation):
[
  {{"description": "detailed image description for AI generation", "topic": "main subject", "category": "attractions/hotels/experiences/dining/shopping/culture/nightlife/family/transportation/skyline", "type": "hero/interior/activity/detail/practical/sunset/night", "filename": "seo-friendly-filename-dubai.jpg", "alt_text": "125-150 char alt text"}}
]

Article:
{article_text}"""
                    
                    response = gemini_client.models.generate_content(
                        model="gemini-2.5-flash",
                        contents=analysis_prompt
                    )
                    
                    response_text = response.text.strip()
                    if response_text.startswith("```"):
                        response_text = response_text.split("```")[1]
                        if response_text.startswith("json"):
                            response_text = response_text[4:]
                    
                    recommendations = json.loads(response_text)
                    
                    st.success(f"נמצאו {len(recommendations)} המלצות לתמונות")
                    
                    index = load_index()
                    images_created = 0
                    
                    progress_bar = st.progress(0, text="מייצר תמונות...")
                    
                    for idx, rec in enumerate(recommendations):
                        st.markdown(f"### 📷 תמונה {idx + 1}: {rec.get('topic', 'Unknown')}")
                        st.write(f"📝 {rec.get('description', '')[:100]}...")
                        
                        prompt = f"Single high-quality photograph. {rec.get('description', '')}. Dubai tourism. One image only, no collage, no grid. Professional travel photography."
                        
                        try:
                            if use_parallel_gen:
                                prompt2 = f"One single photograph showing {rec.get('topic', 'Dubai')} in Dubai. {rec.get('description', '')}. No collage, single image only."
                                results = generate_parallel(prompt, prompt2)
                                
                                for provider, img_bytes in results:
                                    st.image(img_bytes, use_container_width=True)
                                    
                                    image_type_match = next((t for t in IMAGE_TYPES if t["type"] == rec.get("type", "hero")), IMAGE_TYPES[0])
                                    
                                    metadata = save_image_to_library(
                                        rec.get("category", "articles"),
                                        rec.get("topic", "article-image"),
                                        image_type_match,
                                        img_bytes,
                                        prompt,
                                        [rec.get("topic", "dubai").lower(), "article", "dubai"]
                                    )
                                    metadata["provider"] = provider
                                    metadata["alt_text"] = rec.get("alt_text", "")
                                    index["images"].append(metadata)
                                    save_index(index)
                                    images_created += 1
                                    
                                    st.success(f"✅ [{provider.upper()}] נשמר: {metadata['filename']}")
                            else:
                                image_bytes = generate_single_image(prompt)
                                
                                if image_bytes:
                                    st.image(image_bytes, use_container_width=True)
                                    
                                    image_type_match = next((t for t in IMAGE_TYPES if t["type"] == rec.get("type", "hero")), IMAGE_TYPES[0])
                                    
                                    metadata = save_image_to_library(
                                        rec.get("category", "articles"),
                                        rec.get("topic", "article-image"),
                                        image_type_match,
                                        image_bytes,
                                        prompt,
                                        [rec.get("topic", "dubai").lower(), "article", "dubai"]
                                    )
                                    metadata["alt_text"] = rec.get("alt_text", "")
                                    index["images"].append(metadata)
                                    save_index(index)
                                    images_created += 1
                                    
                                    st.success(f"✅ נשמר: {metadata['filename']}")
                                    
                        except Exception as e:
                            if "FREE_CLOUD_BUDGET_EXCEEDED" in str(e):
                                st.error("🛑 תקציב הענן הסתיים")
                                break
                            else:
                                st.warning(f"⚠️ שגיאה ביצירת תמונה: {e}")
                        
                        progress_bar.progress((idx + 1) / len(recommendations), text=f"נוצרו {images_created} תמונות")
                        time.sleep(2)
                    
                    st.success(f"🎉 הושלם! נוצרו {images_created} תמונות למאמר")
                    st.balloons()
                    
                except json.JSONDecodeError:
                    st.error("לא הצלחתי לפענח את ההמלצות. נסה שוב.")
                except Exception as e:
                    st.error(f"שגיאה: {e}")
        else:
            st.warning("הכנס מאמר ארוך יותר (לפחות 100 תווים)")

with tab6:
    st.markdown("## 👹 מצב מפלצת - יצירה המונית חכמה")
    st.markdown("יצירה אוטומטית של עשרות תמונות עם מחקר AI מקדים ומטא-דאטה SEO מלא")
    
    st.markdown("### ⚙️ הגדרות מפלצת")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        monster_count = st.slider("🖼️ כמות תמונות למפלצת", 5, 50, 20, 5)
    with col2:
        use_ai_research = st.checkbox("🔍 מחקר AI לפני יצירה", value=True)
    with col3:
        generate_seo = st.checkbox("📊 יצירת SEO אוטומטי", value=True)
    
    col1, col2 = st.columns(2)
    with col1:
        monster_categories = st.multiselect(
            "📂 קטגוריות ליצירה",
            list(DUBAI_KEYWORDS.keys()),
            default=list(DUBAI_KEYWORDS.keys())[:2]
        )
    with col2:
        ab_testing = st.checkbox("🔬 A/B Testing - יצירת גרסאות מרובות", value=False)
        if ab_testing:
            ab_variations = st.slider("גרסאות לכל תמונה", 2, 5, 3)
        else:
            ab_variations = 1
    
    st.markdown("---")
    
    if st.button("👹 הפעל מפלצת!", type="primary"):
        if not monster_categories:
            st.warning("בחר לפחות קטגוריה אחת")
        else:
            st.markdown("### 🚀 המפלצת יוצאת לדרך!")
            
            all_topics = []
            for cat in monster_categories:
                cat_data = DUBAI_KEYWORDS.get(cat, {})
                topics_list = cat_data.get("topics", [])
                for topic_data in topics_list:
                    all_topics.append({
                        "category": cat,
                        "topic": topic_data["topic"],
                        "keywords": topic_data.get("keywords", [])
                    })
            
            import random
            random.shuffle(all_topics)
            topics_to_process = all_topics[:monster_count]
            
            progress_bar = st.progress(0, text="מתחיל...")
            status_container = st.empty()
            images_container = st.container()
            
            index = load_index()
            total_created = 0
            
            for idx, topic_info in enumerate(topics_to_process):
                topic = topic_info["topic"]
                category = topic_info["category"]
                keywords = topic_info["keywords"]
                
                status_container.info(f"🔄 מעבד: {topic} ({idx + 1}/{len(topics_to_process)})")
                
                try:
                    image_type = IMAGE_TYPES[idx % len(IMAGE_TYPES)]
                    
                    if use_ai_research:
                        status_container.info(f"🔍 חוקר איך {topic} נראה באמת...")
                        enhanced_prompt, research = research_and_enhance_prompt(topic, category, image_type)
                    else:
                        enhanced_prompt = f"Single high-quality photograph of {topic} in Dubai. {image_type.get('prompt', '')}. One image only, no collage."
                        research = ""
                    
                    if ab_testing:
                        status_container.info(f"🔬 יוצר {ab_variations} גרסאות A/B...")
                        results = generate_multi_parallel(enhanced_prompt, topic, ab_variations)
                        
                        for provider, style_name, img_bytes in results:
                            with images_container:
                                cols = st.columns([2, 1])
                                with cols[0]:
                                    st.image(img_bytes, use_container_width=True)
                                with cols[1]:
                                    st.write(f"**{topic}**")
                                    st.write(f"סגנון: {style_name}")
                                    st.write(f"ספק: {provider}")
                                    
                                    if generate_seo:
                                        seo_meta = generate_seo_metadata(topic, category, image_type, research)
                                        st.write(f"Alt: {seo_meta.get('alt_text', '')[:50]}...")
                            
                            metadata = save_image_to_library(
                                category, topic, image_type, img_bytes, enhanced_prompt, keywords, source_provider=provider
                            )
                            metadata["style"] = style_name
                            metadata["provider"] = provider
                            metadata["research"] = research[:500] if research else ""
                            
                            if generate_seo:
                                metadata["seo"] = seo_meta
                            
                            index["images"].append(metadata)
                            save_index(index)
                            total_created += 1
                    else:
                        status_container.info(f"🎨 יוצר תמונה...")
                        result = generate_with_gemini(enhanced_prompt)
                        
                        if result:
                            provider, img_bytes = result
                            
                            seo_meta = {}
                            if generate_seo:
                                seo_meta = generate_seo_metadata(topic, category, image_type, research)
                            
                            with images_container:
                                cols = st.columns([2, 1])
                                with cols[0]:
                                    st.image(img_bytes, use_container_width=True)
                                with cols[1]:
                                    st.write(f"**{topic}**")
                                    st.write(f"קטגוריה: {category}")
                                    if research:
                                        st.expander("📋 מחקר AI").write(research[:300] + "...")
                                    if seo_meta:
                                        st.write(f"**SEO:**")
                                        st.write(f"Alt: {seo_meta.get('alt_text', '')[:50]}...")
                            
                            metadata = save_image_to_library(
                                category, topic, image_type, img_bytes, enhanced_prompt, keywords, source_provider=provider
                            )
                            metadata["research"] = research[:500] if research else ""
                            metadata["provider"] = provider
                            
                            if generate_seo:
                                metadata["seo"] = seo_meta
                            
                            index["images"].append(metadata)
                            save_index(index)
                            total_created += 1
                    
                except Exception as e:
                    if "FREE_CLOUD_BUDGET_EXCEEDED" in str(e):
                        st.error("🛑 תקציב הענן הסתיים!")
                        break
                    else:
                        st.warning(f"⚠️ שגיאה ב-{topic}: {e}")
                
                progress_bar.progress((idx + 1) / len(topics_to_process), text=f"נוצרו {total_created} תמונות")
                time.sleep(1)
            
            st.success(f"🎉 המפלצת סיימה! נוצרו {total_created} תמונות")
            st.balloons()
    
    st.markdown("---")
    st.markdown("### 📜 היסטוריית פרומפטים מוצלחים")
    
    history = load_prompt_history()
    if history.get("prompts"):
        for prompt_entry in reversed(history["prompts"][-10:]):
            with st.expander(f"🕐 {prompt_entry.get('topic', 'Unknown')} - {prompt_entry.get('created_at', '')[:10]}"):
                st.write(f"**קטגוריה:** {prompt_entry.get('category', 'N/A')}")
                st.write(f"**מחקר:** {prompt_entry.get('research', 'N/A')[:200]}...")
                if st.button(f"🔁 השתמש שוב", key=f"reuse_{prompt_entry.get('created_at', '')}"):
                    st.session_state["reuse_prompt"] = prompt_entry.get("enhanced_prompt", "")
                    st.rerun()
    else:
        st.info("אין היסטוריית פרומפטים עדיין. צור תמונות עם מחקר AI כדי לשמור פרומפטים.")
    
    st.markdown("---")
    st.markdown("### ⭐ דירוג תמונות")
    
    ratings = load_ratings()
    all_images = get_all_library_images()
    
    if all_images:
        unrated = [img for img in all_images if img.get("path", "") not in ratings]
        if unrated:
            st.write(f"📊 {len(unrated)} תמונות ממתינות לדירוג")
            
            img_to_rate = unrated[0]
            img_path = Path(img_to_rate["path"])
            
            if img_path.exists():
                col1, col2 = st.columns([2, 1])
                with col1:
                    with open(img_path, 'rb') as f:
                        st.image(f.read(), use_container_width=True)
                with col2:
                    st.write(f"**{img_to_rate.get('topic', 'Unknown')}**")
                    st.write(f"קטגוריה: {img_to_rate.get('category', 'N/A')}")
                    
                    col_a, col_b, col_c = st.columns(3)
                    with col_a:
                        if st.button("👍 טוב", type="primary"):
                            ratings[img_to_rate["path"]] = {"rating": "good", "timestamp": datetime.now().isoformat()}
                            save_ratings(ratings)
                            st.rerun()
                    with col_b:
                        if st.button("👎 רע"):
                            try:
                                img_path_to_delete = Path(img_to_rate["path"])
                                if img_path_to_delete.exists():
                                    img_path_to_delete.unlink()
                                    meta_path = img_path_to_delete.with_suffix('.json')
                                    if meta_path.exists():
                                        meta_path.unlink()
                            except Exception:
                                pass
                            rating_index = load_index()
                            rating_index["images"] = [img for img in rating_index["images"] if img.get("path") != img_to_rate["path"]]
                            save_index(rating_index)
                            ratings[img_to_rate["path"]] = {"rating": "bad", "deleted": True, "timestamp": datetime.now().isoformat()}
                            save_ratings(ratings)
                            st.success("🗑️ תמונה נמחקה!")
                            st.rerun()
                    with col_c:
                        if st.button("➡️ דלג"):
                            ratings[img_to_rate["path"]] = {"rating": "skip", "timestamp": datetime.now().isoformat()}
                            save_ratings(ratings)
                            st.rerun()
            else:
                rating_index = load_index()
                rating_index["images"] = [img for img in rating_index["images"] if img.get("path") != img_to_rate["path"]]
                save_index(rating_index)
                ratings[img_to_rate["path"]] = {"rating": "skip", "missing": True, "timestamp": datetime.now().isoformat()}
                save_ratings(ratings)
                st.rerun()
        else:
            st.success("✅ כל התמונות דורגו!")
        
        def get_rating_value(r):
            if isinstance(r, dict):
                return r.get("rating", "")
            return r
        good_count = sum(1 for r in ratings.values() if get_rating_value(r) in ["good", "like"])
        bad_count = sum(1 for r in ratings.values() if get_rating_value(r) == "bad")
        st.write(f"📊 סטטיסטיקות: 👍 {good_count} טובות | 👎 {bad_count} רעות")

with tab7:
    st.markdown("## 📋 עורך נושאים")
    st.markdown("הוסף, ערוך ומחק נושאים | צפה בכמות תמונות לכל נושא | קבל המלצות לנושאים חסרים")
    
    index = load_index()
    topic_counts = count_images_per_topic(index)
    custom_data = load_custom_topics()
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### ➕ הוסף נושא חדש")
        new_topic = st.text_input("שם הנושא", placeholder="למשל: Palm Jumeirah Beach")
        new_category = st.selectbox("קטגוריה", list(DUBAI_KEYWORDS.keys()), key="new_cat")
        new_keywords = st.text_input("מילות מפתח (מופרדות בפסיק)", placeholder="beach, palm, island, luxury")
        new_priority = st.slider("עדיפות", 1, 10, 5)
        
        if st.button("➕ הוסף נושא", type="primary"):
            if new_topic:
                custom_data["topics"].append({
                    "topic": new_topic,
                    "category": new_category,
                    "keywords": [k.strip() for k in new_keywords.split(",") if k.strip()],
                    "priority": new_priority,
                    "added_at": datetime.now().isoformat()
                })
                save_custom_topics(custom_data)
                st.success(f"✅ נוסף: {new_topic}")
                st.rerun()
            else:
                st.warning("נא להזין שם נושא")
    
    with col2:
        st.markdown("### 🎯 המלצות לנושאים חסרים")
        all_topics_rec = get_all_topics() + custom_data.get("topics", [])
        missing_topics = [t for t in all_topics_rec if topic_counts.get(t["topic"], 0) < 100]
        missing_topics.sort(key=lambda x: (x.get("priority", 5), -topic_counts.get(x["topic"], 0)), reverse=True)
        
        if missing_topics:
            st.write(f"📊 {len(missing_topics)} נושאים עם פחות מ-100 תמונות:")
            
            for rec in missing_topics[:5]:
                current = topic_counts.get(rec["topic"], 0)
                with st.expander(f"🔸 {rec['topic']} ({current}/100 תמונות)"):
                    st.write(f"**קטגוריה:** {rec.get('category', 'N/A')}")
                    st.write(f"**מילות מפתח:** {', '.join(rec.get('keywords', []))}")
                    st.write(f"**עדיפות:** {'⭐' * min(rec.get('priority', 5), 5)}")
                    
                    if st.button(f"🚀 צור 10 תמונות", key=f"gen_{rec['topic']}"):
                        st.session_state["quick_gen_topic"] = rec
                        st.rerun()
        else:
            st.success("🎉 כל הנושאים הגיעו ל-100 תמונות!")
    
    st.markdown("---")
    st.markdown("### 📚 כל הנושאים במערכת")
    
    search_topic = st.text_input("🔍 חפש נושא", placeholder="חפש לפי שם...")
    
    all_topics_display = get_all_topics() + custom_data.get("topics", [])
    if search_topic:
        all_topics_display = [t for t in all_topics_display if search_topic.lower() in t["topic"].lower()]
    
    all_topics_display.sort(key=lambda x: topic_counts.get(x["topic"], 0), reverse=True)
    
    topics_per_page = 20
    total_pages = max(1, len(all_topics_display) // topics_per_page + 1)
    page = st.number_input("עמוד", 1, total_pages, 1)
    start_idx = (page - 1) * topics_per_page
    end_idx = start_idx + topics_per_page
    
    custom_topic_names = [t["topic"] for t in custom_data.get("topics", [])]
    for row_idx, topic_item in enumerate(all_topics_display[start_idx:end_idx]):
        topic_name = topic_item["topic"]
        img_count = topic_counts.get(topic_name, 0)
        unique_key = f"{page}_{row_idx}"
        
        col1, col2, col3, col4 = st.columns([3, 1, 1, 1])
        
        with col1:
            is_custom = topic_name in custom_topic_names
            prefix = "🔹" if is_custom else "📍"
            st.write(f"{prefix} **{topic_name}**")
            st.caption(f"קטגוריה: {topic_item.get('category', 'N/A')} | מילות מפתח: {', '.join(topic_item.get('keywords', [])[:3])}")
        
        with col2:
            if img_count >= 100:
                st.success(f"✅ {img_count}")
            elif img_count >= 50:
                st.warning(f"🟡 {img_count}")
            else:
                st.error(f"🔴 {img_count}")
        
        with col3:
            if st.button("🖼️", key=f"view_{unique_key}", help="צפה בתמונות"):
                st.session_state["view_topic"] = topic_name
        
        with col4:
            if topic_name in custom_topic_names:
                if st.button("🗑️", key=f"del_{unique_key}", help="מחק נושא"):
                    custom_data["topics"] = [t for t in custom_data["topics"] if t["topic"] != topic_name]
                    save_custom_topics(custom_data)
                    st.rerun()
    
    if "view_topic" in st.session_state:
        st.markdown("---")
        view_topic = st.session_state["view_topic"]
        st.markdown(f"### 🖼️ תמונות של: {view_topic}")
        
        topic_images = [img for img in index["images"] if img.get("topic") == view_topic]
        
        if topic_images:
            cols = st.columns(4)
            for idx, img in enumerate(topic_images[:12]):
                with cols[idx % 4]:
                    img_path = Path(img["path"])
                    if img_path.exists():
                        with open(img_path, 'rb') as f:
                            st.image(f.read(), use_container_width=True)
                        st.caption(img.get("filename", "")[:20])
        else:
            st.info("אין תמונות לנושא זה עדיין")
        
        if st.button("❌ סגור"):
            del st.session_state["view_topic"]
            st.rerun()
    
    if "quick_gen_topic" in st.session_state:
        st.markdown("---")
        topic_to_gen = st.session_state["quick_gen_topic"]
        topic_category = topic_to_gen.get("category", "attractions")
        st.markdown(f"### 🚀 יצירת תמונות: {topic_to_gen['topic']}")
        st.caption(f"קטגוריה: {topic_category}")
        
        with st.spinner(f"יוצר 10 תמונות ל-{topic_to_gen['topic']}..."):
            created = 0
            progress = st.progress(0)
            gen_index = load_index()
            
            for i in range(10):
                try:
                    image_type = IMAGE_TYPES[i % len(IMAGE_TYPES)]
                    prompt = f"Professional tourism photograph: {topic_to_gen['topic']} in Dubai. {image_type['prompt']}. Single photograph, no collage, high quality travel photography."
                    
                    result = generate_with_gemini(prompt)
                    if result:
                        provider, img_bytes = result
                        metadata = save_image_to_library(
                            topic_category,
                            topic_to_gen["topic"],
                            image_type,
                            img_bytes,
                            prompt,
                            topic_to_gen.get("keywords", [])
                        )
                        gen_index["images"].append(metadata)
                        save_index(gen_index)
                        created += 1
                    
                    progress.progress((i + 1) / 10)
                    time.sleep(1)
                except Exception as e:
                    if "FREE_CLOUD_BUDGET_EXCEEDED" in str(e):
                        st.error("🛑 תקציב הענן הסתיים!")
                        break
                    st.warning(f"שגיאה: {e}")
            
            st.success(f"✅ נוצרו {created} תמונות!")
            del st.session_state["quick_gen_topic"]
            st.rerun()

with tab8:
    st.markdown("## 📦 ייבוא תמונות מ-Freepik")
    st.markdown("חפש והורד תמונות דובאי מ-Freepik לפי הרשיון שלך")
    
    if not FREEPIK_API_KEY:
        st.error("⚠️ מפתח API של Freepik לא הוגדר. הוסף את FREEPIK_API_KEY בהגדרות.")
    else:
        freepik_data = load_freepik_downloads()
        st.info(f"📊 הורדו עד כה: {len(freepik_data.get('downloaded_ids', []))} תמונות מ-Freepik")
        
        st.markdown("### 🔍 חיפוש ידני")
        st.caption("✅ תמונות שכבר הורדו מוסתרות אוטומטית")
        col1, col2 = st.columns([3, 1])
        with col1:
            freepik_query = st.text_input("🔍 חיפוש ב-Freepik", placeholder="Dubai Burj Khalifa, desert safari, marina...", key="freepik_search")
        with col2:
            freepik_limit = st.selectbox("מספר תוצאות", [10, 20, 50], index=1, key="freepik_limit")
        
        if st.button("🔍 חפש ב-Freepik", type="primary", key="search_freepik_btn"):
            if freepik_query:
                with st.spinner("מחפש ב-Freepik..."):
                    results, error = search_freepik(freepik_query, limit=freepik_limit)
                    
                    if error:
                        if "RATE_LIMITED" in error:
                            st.error("⚠️ חריגה ממגבלת בקשות - נסה שוב מאוחר יותר")
                        else:
                            st.error(f"❌ {error}")
                    elif results:
                        data = results.get("data", [])
                        downloaded_ids = freepik_data.get("downloaded_ids", [])
                        deleted_ids = freepik_data.get("deleted_ids", [])
                        filtered_data = [r for r in data if str(r.get("id", "")) not in downloaded_ids and str(r.get("id", "")) not in deleted_ids]
                        already_count = len(data) - len(filtered_data)
                        if already_count > 0:
                            st.success(f"נמצאו {len(filtered_data)} תמונות חדשות ({already_count} כבר במאגר)")
                        else:
                            st.success(f"נמצאו {len(filtered_data)} תמונות")
                        st.session_state["freepik_results"] = filtered_data
                        st.session_state["freepik_search_topic"] = freepik_query
                    else:
                        st.info("לא נמצאו תוצאות")
        
        if "freepik_results" in st.session_state and st.session_state["freepik_results"]:
            results = st.session_state["freepik_results"]
            search_topic = st.session_state.get("freepik_search_topic", "dubai")
            
            st.markdown(f"### 📷 תוצאות חיפוש: {search_topic}")
            
            if st.button("📥 הורד את כל התמונות", key="download_all_freepik"):
                freepik_data = load_freepik_downloads()
                index = load_index()
                downloaded = 0
                skipped = 0
                errors = 0
                
                progress = st.progress(0)
                status = st.empty()
                
                for idx, resource in enumerate(results):
                    resource_id = str(resource.get("id", ""))
                    
                    if resource_id in freepik_data.get("downloaded_ids", []):
                        skipped += 1
                        progress.progress((idx + 1) / len(results))
                        continue
                    
                    status.text(f"מוריד {idx + 1}/{len(results)}: {resource.get('title', '')[:30]}...")
                    
                    download_url, err = get_freepik_download_url(resource_id)
                    if err or not download_url:
                        errors += 1
                        progress.progress((idx + 1) / len(results))
                        continue
                    
                    img_bytes, err = download_freepik_image(resource_id, download_url)
                    if err or not img_bytes:
                        errors += 1
                        progress.progress((idx + 1) / len(results))
                        continue
                    
                    metadata = save_freepik_to_library(img_bytes, resource, search_topic, "freepik")
                    index["images"].append(metadata)
                    
                    freepik_data["downloaded_ids"].append(resource_id)
                    freepik_data["downloads"].append({
                        "id": resource_id,
                        "topic": search_topic,
                        "title": resource.get("title", ""),
                        "downloaded_at": datetime.now().isoformat()
                    })
                    
                    downloaded += 1
                    progress.progress((idx + 1) / len(results))
                    time.sleep(0.5)
                
                save_index(index)
                save_freepik_downloads(freepik_data)
                status.empty()
                
                st.success(f"✅ הורדו {downloaded} תמונות, דולגו {skipped} (כבר קיימות), {errors} שגיאות")
                st.session_state["freepik_results"] = []
                st.rerun()
            
            cols = st.columns(4)
            for idx, resource in enumerate(results[:20]):
                with cols[idx % 4]:
                    preview_url = resource.get("image", {}).get("source", {}).get("url", "")
                    if not preview_url:
                        preview_url = resource.get("thumbnail", {}).get("url", "")
                    
                    if preview_url:
                        st.image(preview_url, use_container_width=True)
                    
                    resource_id = str(resource.get("id", ""))
                    already_downloaded = resource_id in freepik_data.get("downloaded_ids", [])
                    
                    title = resource.get("title", "")[:30]
                    if already_downloaded:
                        st.caption(f"✅ {title}")
                    else:
                        st.caption(f"📷 {title}")
                    
                    if not already_downloaded:
                        if st.button("📥 הורד", key=f"dl_freepik_{resource_id}"):
                            with st.spinner("מוריד..."):
                                download_url, err = get_freepik_download_url(resource_id)
                                if err:
                                    st.error(err)
                                elif download_url:
                                    img_bytes, err = download_freepik_image(resource_id, download_url)
                                    if err:
                                        st.error(err)
                                    elif img_bytes:
                                        metadata = save_freepik_to_library(img_bytes, resource, search_topic, "freepik")
                                        index = load_index()
                                        index["images"].append(metadata)
                                        save_index(index)
                                        
                                        freepik_data = load_freepik_downloads()
                                        freepik_data["downloaded_ids"].append(resource_id)
                                        freepik_data["downloads"].append({
                                            "id": resource_id,
                                            "topic": search_topic,
                                            "title": resource.get("title", ""),
                                            "downloaded_at": datetime.now().isoformat()
                                        })
                                        save_freepik_downloads(freepik_data)
                                        
                                        st.success("✅ נשמר!")
                                        st.rerun()
        
        st.markdown("---")
        st.markdown("### 🤖 ייבוא אוטומטי לפי נושאים")
        st.markdown("הורד תמונות מ-Freepik לכל הנושאים במערכת")
        
        all_topics = get_all_topics()
        col1, col2 = st.columns(2)
        with col1:
            images_per_topic = st.selectbox("תמונות לכל נושא", [5, 10, 20], index=1, key="auto_images_per_topic")
        with col2:
            max_topics = st.selectbox("מקסימום נושאים", [5, 10, 20, 50], index=1, key="auto_max_topics")
        
        if st.button("🚀 התחל ייבוא אוטומטי", key="auto_freepik_import"):
            freepik_data = load_freepik_downloads()
            index = load_index()
            total_downloaded = 0
            topics_processed = 0
            
            progress = st.progress(0)
            status = st.empty()
            log = st.empty()
            
            for topic_idx, topic_item in enumerate(all_topics[:max_topics]):
                topic_name = topic_item["topic"]
                keywords = topic_item.get("keywords", [])
                
                search_term = f"Dubai {topic_name}"
                status.text(f"🔍 מחפש: {search_term}")
                
                results, error = search_freepik(search_term, limit=images_per_topic)
                
                if error:
                    log.warning(f"שגיאה בחיפוש {topic_name}: {error}")
                    continue
                
                if results and results.get("data"):
                    for resource in results["data"]:
                        resource_id = str(resource.get("id", ""))
                        
                        if resource_id in freepik_data.get("downloaded_ids", []):
                            continue
                        
                        download_url, err = get_freepik_download_url(resource_id)
                        if err or not download_url:
                            continue
                        
                        img_bytes, err = download_freepik_image(resource_id, download_url)
                        if err or not img_bytes:
                            continue
                        
                        metadata = save_freepik_to_library(img_bytes, resource, topic_name, "freepik")
                        index["images"].append(metadata)
                        
                        freepik_data["downloaded_ids"].append(resource_id)
                        freepik_data["downloads"].append({
                            "id": resource_id,
                            "topic": topic_name,
                            "title": resource.get("title", ""),
                            "downloaded_at": datetime.now().isoformat()
                        })
                        
                        total_downloaded += 1
                        time.sleep(0.3)
                
                topics_processed += 1
                progress.progress((topic_idx + 1) / min(len(all_topics), max_topics))
                log.text(f"📊 עובד נושאים: {topics_processed} | הורדות: {total_downloaded}")
            
            save_index(index)
            save_freepik_downloads(freepik_data)
            
            status.empty()
            log.empty()
            st.success(f"✅ סיום! הורדו {total_downloaded} תמונות מ-{topics_processed} נושאים")
        
        st.markdown("---")
        st.markdown("### 🚀 הורדת כל דובאי מ-Freepik (עם תור)")
        st.markdown("מוריד את כל התמונות הזמינות של דובאי עם rate limiting אוטומטי")
        
        queue_state = load_freepik_queue()
        st.info(f"📊 סטטוס תור: עמוד {queue_state.get('current_page', 1)} | הורדו {queue_state.get('total_downloaded', 0)} | שגיאות {queue_state.get('errors', 0)}")
        
        col1, col2 = st.columns(2)
        with col1:
            bulk_pages = st.selectbox("מספר עמודים להורדה", [5, 10, 20, 50], index=1, key="bulk_pages")
        with col2:
            delay = st.selectbox("השהייה בין הורדות (שניות)", [1, 2, 3, 5], index=1, key="bulk_delay")
        
        if st.button("🚀 התחל הורדה מאסיבית", key="bulk_dubai_download"):
            with st.spinner("מוריד תמונות דובאי..."):
                progress = st.progress(0)
                status = st.empty()
                
                downloaded, errors, result = bulk_download_dubai_freepik(
                    max_pages=bulk_pages,
                    images_per_page=50,
                    delay_seconds=delay
                )
                
                progress.progress(1.0)
                status.empty()
                
                if result == "rate_limited":
                    st.warning(f"⚠️ הגענו למגבלת API. הורדו {downloaded} תמונות. המשך מאוחר יותר.")
                else:
                    st.success(f"✅ הסתיים! הורדו {downloaded} תמונות, {errors} שגיאות")
        
        if st.button("🔄 אפס תור", key="reset_bulk_queue"):
            save_freepik_queue({"running": False, "current_page": 1, "total_downloaded": 0, "errors": 0, "last_run": None})
            st.success("התור אופס!")
            st.rerun()

with tab9:
    st.markdown("## 🔬 סוכן איכות AI")
    st.markdown("הסוכן סורק תמונות, מדרג אותן ומזהה תמונות לא אמינות או לא רלוונטיות")
    
    index = load_index()
    ai_reviews = load_ai_reviews()
    
    reviewed_count = len(ai_reviews.get("reviewed_paths", []))
    total_images = len(index["images"])
    pending = total_images - reviewed_count
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("סה״כ תמונות", total_images)
    with col2:
        st.metric("נסרקו", reviewed_count)
    with col3:
        st.metric("ממתינות לסריקה", pending)
    
    st.markdown("### 🔍 סריקת תמונות")
    
    scan_count = st.selectbox("מספר תמונות לסריקה", [5, 10, 20, 50], index=0, key="scan_count")
    
    if st.button("🔬 התחל סריקת איכות", key="start_quality_scan"):
        unreviewed = [img for img in index["images"] if img.get("path") not in ai_reviews.get("reviewed_paths", [])]
        
        if not unreviewed:
            st.success("🎉 כל התמונות נסרקו!")
        else:
            progress = st.progress(0)
            status = st.empty()
            
            to_scan = unreviewed[:scan_count]
            for idx, img in enumerate(to_scan):
                img_path = img.get("path", "")
                status.text(f"סורק {idx + 1}/{len(to_scan)}: {Path(img_path).name[:30]}...")
                
                if Path(img_path).exists():
                    result = analyze_image_quality(img_path)
                    
                    review_entry = {
                        "path": img_path,
                        "filename": img.get("filename", ""),
                        "topic": img.get("topic", ""),
                        "score": result.get("score", 5),
                        "is_dubai": result.get("is_dubai", True),
                        "is_ai_generated": result.get("is_ai_generated", False),
                        "notes": result.get("quality_notes", ""),
                        "recommendation": result.get("recommendation", "review"),
                        "reviewed_at": datetime.now().isoformat()
                    }
                    
                    ai_reviews["reviews"].append(review_entry)
                    ai_reviews["reviewed_paths"].append(img_path)
                    save_ai_reviews(ai_reviews)
                
                progress.progress((idx + 1) / len(to_scan))
                time.sleep(1)
            
            status.empty()
            st.success(f"✅ נסרקו {len(to_scan)} תמונות!")
            st.rerun()
    
    st.markdown("---")
    st.markdown("### ⚠️ תמונות מומלצות להסרה")
    
    low_score_reviews = [r for r in ai_reviews.get("reviews", []) if r.get("score", 10) <= 4 or r.get("recommendation") == "remove"]
    
    if low_score_reviews:
        st.warning(f"נמצאו {len(low_score_reviews)} תמונות עם ציון נמוך")
        
        for idx, review in enumerate(low_score_reviews[:20]):
            col1, col2, col3, col4 = st.columns([2, 1, 2, 1])
            
            with col1:
                img_path = Path(review.get("path", ""))
                if img_path.exists():
                    with open(img_path, 'rb') as f:
                        st.image(f.read(), width=150)
            
            with col2:
                score = review.get("score", 0)
                if score <= 3:
                    st.error(f"ציון: {score}/10")
                else:
                    st.warning(f"ציון: {score}/10")
                
                if not review.get("is_dubai", True):
                    st.caption("❌ לא דובאי")
                if review.get("is_ai_generated", False):
                    st.caption("🤖 AI generated")
            
            with col3:
                st.caption(review.get("notes", "")[:100])
                st.caption(f"נושא: {review.get('topic', 'N/A')}")
            
            with col4:
                unique_key = f"rm_{idx}_{hash(review.get('path', ''))}"
                if st.button("🗑️ מחק", key=unique_key):
                    img_path = Path(review.get("path", ""))
                    if img_path.exists():
                        img_path.unlink()
                    
                    json_path = img_path.with_suffix('.json')
                    if json_path.exists():
                        json_path.unlink()
                    
                    index = load_index()
                    index["images"] = [i for i in index["images"] if i.get("path") != str(img_path)]
                    save_index(index)
                    
                    ai_reviews["reviews"] = [r for r in ai_reviews["reviews"] if r.get("path") != str(img_path)]
                    save_ai_reviews(ai_reviews)
                    
                    st.success("נמחק!")
                    st.rerun()
    else:
        st.success("🎉 לא נמצאו תמונות בעייתיות!")
    
    st.markdown("---")
    st.markdown("### 📊 סטטיסטיקות סריקה")
    
    if ai_reviews.get("reviews"):
        scores = [r.get("score", 5) for r in ai_reviews["reviews"]]
        avg_score = sum(scores) / len(scores)
        
        dubai_count = sum(1 for r in ai_reviews["reviews"] if r.get("is_dubai", True))
        ai_gen_count = sum(1 for r in ai_reviews["reviews"] if r.get("is_ai_generated", False))
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("ציון ממוצע", f"{avg_score:.1f}/10")
        with col2:
            st.metric("תמונות דובאי אמיתיות", f"{dubai_count}/{len(ai_reviews['reviews'])}")
        with col3:
            st.metric("תמונות AI", ai_gen_count)

with tab10:
    st.markdown("## 📁 קולקציות")
    st.markdown("צור אוספים מותאמים אישית של תמונות לפרויקטים שונים")
    
    collections_data = load_collections()
    all_images_col = get_all_library_images()
    
    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.markdown("### ➕ קולקציה חדשה")
        new_col_name = st.text_input("שם הקולקציה", placeholder="למשל: מאמר ברג' כליפה")
        new_col_desc = st.text_area("תיאור", placeholder="תיאור קצר של הקולקציה", height=80)
        
        if st.button("✨ צור קולקציה", type="primary"):
            if new_col_name:
                new_collection = {
                    "id": f"col_{int(time.time())}",
                    "name": new_col_name,
                    "description": new_col_desc,
                    "images": [],
                    "created_at": datetime.now().isoformat()
                }
                collections_data["collections"].append(new_collection)
                save_collections(collections_data)
                st.success(f"✅ נוצרה קולקציה: {new_col_name}")
                st.rerun()
            else:
                st.warning("נא להזין שם לקולקציה")
        
        st.markdown("---")
        st.markdown("### 📋 קולקציות קיימות")
        
        for idx, col_item in enumerate(collections_data.get("collections", [])):
            with st.expander(f"📁 {col_item['name']} ({len(col_item.get('images', []))} תמונות)"):
                st.caption(col_item.get("description", ""))
                st.caption(f"נוצרה: {col_item.get('created_at', 'N/A')[:10]}")
                
                if st.button("🗑️ מחק קולקציה", key=f"del_col_{idx}"):
                    collections_data["collections"] = [c for c in collections_data["collections"] if c["id"] != col_item["id"]]
                    save_collections(collections_data)
                    st.rerun()
    
    with col2:
        st.markdown("### 🖼️ הוסף תמונות לקולקציה")
        
        collection_names = [c["name"] for c in collections_data.get("collections", [])]
        if collection_names:
            selected_collection = st.selectbox("בחר קולקציה", collection_names, key="add_to_col")
            
            st.markdown("#### תמונות זמינות (20 אחרונות)")
            recent_images = sorted(all_images_col, key=lambda x: x.get("created_at", ""), reverse=True)[:20]
            
            cols = st.columns(5)
            for idx, img in enumerate(recent_images):
                with cols[idx % 5]:
                    img_path = Path(img["path"])
                    if img_path.exists():
                        with open(img_path, 'rb') as f:
                            st.image(f.read(), use_container_width=True)
                        
                        selected_col_data = next((c for c in collections_data["collections"] if c["name"] == selected_collection), None)
                        is_in_col = selected_col_data and img["path"] in selected_col_data.get("images", [])
                        
                        btn_label = "✅" if is_in_col else "➕"
                        unique_img_key = hash(img["path"])
                        if st.button(btn_label, key=f"add_col_{idx}_{unique_img_key}"):
                            for c in collections_data["collections"]:
                                if c["name"] == selected_collection:
                                    if img["path"] not in c.get("images", []):
                                        c.setdefault("images", []).append(img["path"])
                                    else:
                                        c["images"].remove(img["path"])
                                    save_collections(collections_data)
                                    st.rerun()
        else:
            st.info("צור קולקציה ראשונה בצד שמאל")

with tab11:
    st.markdown("## ⚔️ מצב השוואה")
    st.markdown("השווה שתי תמונות זו לצד זו והצבע על המועדפת")
    
    all_images_comp = get_all_library_images()
    ratings_comp = load_ratings()
    
    if len(all_images_comp) < 2:
        st.warning("נדרשות לפחות 2 תמונות במאגר")
    else:
        if 'comparison_pair' not in st.session_state:
            import random
            st.session_state.comparison_pair = random.sample(all_images_comp, 2)
        
        col1, col2 = st.columns(2)
        
        img1, img2 = st.session_state.comparison_pair
        
        with col1:
            st.markdown("### תמונה א'")
            img1_path = Path(img1["path"])
            if img1_path.exists():
                with open(img1_path, 'rb') as f:
                    img1_data = f.read()
                    st.image(img1_data, use_container_width=True)
                
                badge1, _ = get_source_badge(img1)
                st.markdown(f"**{badge1}**")
                st.caption(f"📁 {img1.get('filename', 'N/A')[:40]}")
                st.caption(f"📂 {img1.get('topic', 'N/A')}")
                
                if st.button("👑 בחר תמונה א'", type="primary", use_container_width=True, key="vote_1"):
                    ratings_comp[img1["path"]] = "like"
                    save_ratings(ratings_comp)
                    import random
                    st.session_state.comparison_pair = random.sample(all_images_comp, 2)
                    st.success("הצבעה נשמרה!")
                    st.rerun()
        
        with col2:
            st.markdown("### תמונה ב'")
            img2_path = Path(img2["path"])
            if img2_path.exists():
                with open(img2_path, 'rb') as f:
                    img2_data = f.read()
                    st.image(img2_data, use_container_width=True)
                
                badge2, _ = get_source_badge(img2)
                st.markdown(f"**{badge2}**")
                st.caption(f"📁 {img2.get('filename', 'N/A')[:40]}")
                st.caption(f"📂 {img2.get('topic', 'N/A')}")
                
                if st.button("👑 בחר תמונה ב'", type="primary", use_container_width=True, key="vote_2"):
                    ratings_comp[img2["path"]] = "like"
                    save_ratings(ratings_comp)
                    import random
                    st.session_state.comparison_pair = random.sample(all_images_comp, 2)
                    st.success("הצבעה נשמרה!")
                    st.rerun()
        
        st.markdown("---")
        col1, col2, col3 = st.columns(3)
        with col1:
            if st.button("🔀 זוג חדש", use_container_width=True):
                import random
                st.session_state.comparison_pair = random.sample(all_images_comp, 2)
                st.rerun()
        with col2:
            if st.button("👎 שתיהן גרועות", use_container_width=True):
                import random
                st.session_state.comparison_pair = random.sample(all_images_comp, 2)
                st.rerun()
        with col3:
            liked_count = len([r for r in ratings_comp.values() if r == "like"])
            st.metric("סה״כ הצבעות", liked_count)

with tab12:
    st.markdown("## 📦 ייצוא ZIP")
    st.markdown("בחר תמונות והורד כקובץ ZIP עם מטאדאטה")
    
    all_images_zip = get_all_library_images()
    captions_zip = load_captions()
    
    if 'selected_for_zip' not in st.session_state:
        st.session_state.selected_for_zip = set()
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        st.markdown("### 🖼️ בחר תמונות לייצוא")
        
        zip_search = st.text_input("🔍 סנן תמונות", placeholder="חפש לפי נושא...", key="zip_search")
        
        filtered_zip = all_images_zip
        if zip_search:
            filtered_zip = [img for img in all_images_zip if zip_search.lower() in img.get("topic", "").lower() or zip_search.lower() in img.get("searchable_text", "").lower()]
        
        cols = st.columns(5)
        for idx, img in enumerate(filtered_zip[:50]):
            with cols[idx % 5]:
                img_path = Path(img["path"])
                if img_path.exists():
                    with open(img_path, 'rb') as f:
                        st.image(f.read(), use_container_width=True)
                    
                    is_selected = img["path"] in st.session_state.selected_for_zip
                    btn_style = "primary" if is_selected else "secondary"
                    btn_text = "✅" if is_selected else "☐"
                    
                    if st.button(btn_text, key=f"sel_zip_{idx}", type=btn_style):
                        if is_selected:
                            st.session_state.selected_for_zip.discard(img["path"])
                        else:
                            st.session_state.selected_for_zip.add(img["path"])
                        st.rerun()
    
    with col2:
        st.markdown("### 📋 סל ייצוא")
        st.metric("תמונות נבחרות", len(st.session_state.selected_for_zip))
        
        if st.button("🗑️ נקה בחירה", use_container_width=True):
            st.session_state.selected_for_zip = set()
            st.rerun()
        
        st.markdown("---")
        
        include_metadata = st.checkbox("כלול קובץ מטאדאטה", value=True)
        include_captions = st.checkbox("כלול כיתובים עבריים", value=True)
        
        if len(st.session_state.selected_for_zip) > 0:
            import io
            import zipfile
            
            if st.button("📦 צור ZIP", type="primary", use_container_width=True):
                with st.spinner("יוצר קובץ ZIP..."):
                    zip_buffer = io.BytesIO()
                    
                    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
                        metadata_list = []
                        
                        for img_path in st.session_state.selected_for_zip:
                            path = Path(img_path)
                            if path.exists():
                                with open(path, 'rb') as f:
                                    zf.writestr(f"images/{path.name}", f.read())
                                
                                img_meta = next((img for img in all_images_zip if img["path"] == img_path), {})
                                caption = captions_zip.get(img_path, {}).get("caption", "") if include_captions else ""
                                
                                metadata_list.append({
                                    "filename": path.name,
                                    "topic": img_meta.get("topic", ""),
                                    "source": img_meta.get("source", ""),
                                    "keywords": img_meta.get("keywords", []),
                                    "hebrew_caption": caption
                                })
                        
                        if include_metadata:
                            metadata_json = json.dumps(metadata_list, ensure_ascii=False, indent=2)
                            zf.writestr("metadata.json", metadata_json)
                    
                    zip_buffer.seek(0)
                    
                    st.download_button(
                        "⬇️ הורד ZIP",
                        zip_buffer.getvalue(),
                        f"dubai_images_{int(time.time())}.zip",
                        "application/zip",
                        use_container_width=True
                    )
                    st.success(f"✅ ZIP מוכן עם {len(st.session_state.selected_for_zip)} תמונות!")
        else:
            st.info("בחר תמונות משמאל")

st.markdown("---")
col1, col2, col3 = st.columns(3)
with col1:
    index = load_index()
    st.caption(f"📊 {index['stats']['total']} תמונות במאגר")
with col2:
    st.caption("🎨 מנוע תמונות דובאי")
with col3:
    st.caption("⚡ Gemini AI + OpenAI")
