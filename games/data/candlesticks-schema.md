# Strativo World — Candlestick Dataset Schema & Taxonomy Guide

This document defines the schema specification and governance rules for `games/data/candlesticks.json`.

---

## Schema Overview

```json
{
  "version": 1,
  "sourceType": "curated_master",
  "generatedAt": "2026-08-28",
  "totalPatterns": 44,
  "categories": ["single", "double", "triple", "multi", "continuation", "reversal", "indecision"],
  "patterns": [
    {
      "id": "hammer",
      "name": "Hammer",
      "category": "single",
      "bias": "bullish_reversal",
      "candleCount": 1,
      "difficulty": "beginner",
      "aliases": ["Bullish Pin Bar", "Takuri Line"],
      "visual": {
        "bodyRatio": "small",
        "upperWickRatio": "minimal",
        "lowerWickRatio": "long",
        "candles": [
          { "open": 40, "high": 45, "low": 10, "close": 44, "bullish": true, "isDoji": false }
        ]
      },
      "summary": "Concise 1-sentence definition of the formation.",
      "anatomy": "Detailed breakdown of Open, High, Low, Close and wick relations.",
      "context": "Market conditions where this formation is traditionally studied (support, resistance, trends).",
      "commonMistake": "Typical error made by novice traders when identifying or interpreting this pattern.",
      "recognitionTips": [
        "Lower shadow is at least twice the real body height.",
        "Color of body can be green or red, but green indicates slightly stronger buyer close."
      ],
      "learningTags": ["reversal", "support", "rejection", "single"],
      "sourceRefs": ["Nison (1991)", "Bulkowski (2008)", "Strativo Module 1 Note 13"]
    }
  ]
}
```

---

## Field Descriptions

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique lowercase identifier (e.g. `bullish_engulfing`). |
| `name` | string | Canonical human-readable title. |
| `category` | string | Primary morphological group: `single`, `double`, `triple`, `multi`. |
| `bias` | string | Sentiment implication: `bullish_reversal`, `bearish_reversal`, `bullish_continuation`, `bearish_continuation`, `neutral_indecision`, `bullish_momentum`, `bearish_momentum`. |
| `candleCount` | number | Number of candles forming the pattern (1 to 5). |
| `difficulty` | string | Learning tier: `beginner`, `intermediate`, `advanced`. |
| `aliases` | array<string> | Alternative or traditional Japanese names (e.g. `Tsutsumi`, `Kenuki`). |
| `visual.candles` | array<object> | Normalized price geometry (`open`, `high`, `low`, `close`, `bullish`, `isDoji`) for HTML5 Canvas procedural rendering. |
| `summary` | string | Concise 1-sentence overview. |
| `anatomy` | string | Component-by-component structural description. |
| `context` | string | Market environment and location where the pattern is studied. |
| `commonMistake` | string | Common pitfall to avoid. |
| `recognitionTips`| array<string> | Practical rules of thumb for identifying the pattern on a chart. |
| `learningTags` | array<string> | Cross-filtering tags for search and categorization. |
| `sourceRefs` | array<string> | Citations from technical analysis literature. |

---

## Rules for Adding New Patterns
1. **Uniqueness**: `id` and `name` must be globally unique.
2. **Procedural Rendering**: `visual.candles` must contain valid integer coordinates within range `[0..60]` for consistent scaling on Canvas.
3. **No Direct Trading Claims**: Never phrase pattern definitions as certainty or trade guarantees. Always use educational language emphasizing confirmation, market context, and risk management.
