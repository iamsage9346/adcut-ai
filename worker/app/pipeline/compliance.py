"""의료광고법 검수: 금지어 목록 1차 + LLM 판단 2차."""
from .. import llm

BANNED_PATTERNS = [
    "100%", "완치", "부작용 없", "효과 보장", "최고", "유일", "1위", "전후 비교", "비포 애프터", "할인", "이벤트가",
]

SYSTEM = (
    "당신은 대한민국 의료법 제56조(의료광고 금지 등) 검수 담당자입니다. "
    "주어진 자막/대본에서 위반 소지가 있는 표현을 찾아 "
    '{"issues":[{"text":"...","reason":"...","suggestion":"..."}]} 형식의 JSON으로만 답하세요.'
)


def quick_check(text: str) -> list[str]:
    return [p for p in BANNED_PATTERNS if p in text]


def llm_check(text: str) -> str:
    return llm.ask(SYSTEM, text, json=True)
