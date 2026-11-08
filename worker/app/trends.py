"""YouTube Data API v3 트렌드 수집 (하루 할당량 10,000 유닛, search 1회 = 100 유닛)."""
from googleapiclient.discovery import build

from .config import settings


def search_shorts(query: str, max_results: int = 25) -> list[dict]:
    yt = build("youtube", "v3", developerKey=settings.youtube_api_key)
    res = yt.search().list(q=query, part="id", type="video", videoDuration="short", order="viewCount", regionCode="KR", relevanceLanguage="ko", maxResults=max_results).execute()
    ids = [it["id"]["videoId"] for it in res.get("items", [])]
    if not ids:
        return []
    stats = yt.videos().list(id=",".join(ids), part="snippet,statistics,contentDetails").execute()
    return stats.get("items", [])
