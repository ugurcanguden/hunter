# Center Hit PocketBase Campaign Schema

## Collections

### `campaign_packs`

Recommended fields:

- `packId` text unique required
- `order` number unique required
- `title` text required
- `subtitle` text optional
- `coverTone` select optional: `cyan`, `amber`, `red`, `mixed`
- `levelCount` number required
- `startOrder` number required
- `endOrder` number required
- `unlockAfterPackId` text optional
- `isPublished` bool required
- `contentVersion` number required
- `metadata` json optional

Example:

```json
{
  "packId": "pack-02",
  "order": 2,
  "title": "Neon Trials",
  "subtitle": "3 new precision levels",
  "coverTone": "cyan",
  "levelCount": 3,
  "startOrder": 11,
  "endOrder": 13,
  "unlockAfterPackId": "pack-01",
  "isPublished": true,
  "contentVersion": 1
}
```

### `campaign_levels`

Recommended fields:

- `levelId` text unique required
- `packId` text required
- `order` number unique required
- `title` text required
- `difficulty` select required: `easy`, `medium`, `hard`
- `launcher` json required
- `target` json required
- `ball` json required
- `objective` json required
- `stars` json required
- `obstacles` json optional
- `metadata` json optional
- `isPublished` bool required
- `contentVersion` number required

Examples:

```json
{
  "levelId": "level-11",
  "packId": "pack-02",
  "order": 11,
  "title": "Neon Lock",
  "difficulty": "hard",
  "launcher": {
    "speed": 2.24,
    "moveRangePercent": 0.4
  },
  "target": {
    "size": 0.46,
    "speed": 1.84,
    "movementAxis": "horizontal",
    "movementBehavior": "loop",
    "moveRangePercent": 0.42
  },
  "ball": {
    "speed": 1.34
  },
  "objective": {
    "requiredHits": 12,
    "requiredPerfectHits": 5,
    "maxMissAllowed": 1,
    "maxShots": 14
  },
  "stars": {
    "oneStarScore": 860,
    "twoStarScore": 1120,
    "threeStarScore": 1320
  },
  "obstacles": [
    {
      "id": "obs-11-a",
      "type": "blocker",
      "xPercent": 0.5,
      "yPercent": 0.52,
      "widthPercent": 0.11,
      "heightPercent": 0.04
    }
  ],
  "isPublished": true,
  "contentVersion": 1
}
```

```json
{
  "levelId": "level-12",
  "packId": "pack-02",
  "order": 12,
  "title": "Twin Drift",
  "difficulty": "hard",
  "launcher": {
    "speed": 2.32,
    "moveRangePercent": 0.42
  },
  "target": {
    "size": 0.44,
    "speed": 1.92,
    "movementAxis": "horizontal",
    "movementBehavior": "bounce",
    "moveRangePercent": 0.44
  },
  "ball": {
    "speed": 1.36
  },
  "objective": {
    "requiredHits": 12,
    "requiredPerfectHits": 6,
    "maxMissAllowed": 1,
    "maxShots": 14
  },
  "stars": {
    "oneStarScore": 900,
    "twoStarScore": 1180,
    "threeStarScore": 1380
  },
  "obstacles": [
    {
      "id": "obs-12-a",
      "type": "blocker",
      "xPercent": 0.34,
      "yPercent": 0.5,
      "widthPercent": 0.11,
      "heightPercent": 0.038
    },
    {
      "id": "obs-12-b",
      "type": "blocker",
      "xPercent": 0.66,
      "yPercent": 0.5,
      "widthPercent": 0.11,
      "heightPercent": 0.038
    }
  ],
  "isPublished": true,
  "contentVersion": 1
}
```

```json
{
  "levelId": "level-13",
  "packId": "pack-02",
  "order": 13,
  "title": "Gate Pulse",
  "difficulty": "hard",
  "launcher": {
    "speed": 2.4,
    "moveRangePercent": 0.44
  },
  "target": {
    "size": 0.42,
    "speed": 2.02,
    "movementAxis": "horizontal",
    "movementBehavior": "loop",
    "moveRangePercent": 0.46
  },
  "ball": {
    "speed": 1.38
  },
  "objective": {
    "requiredHits": 13,
    "requiredPerfectHits": 6,
    "maxMissAllowed": 1,
    "maxShots": 15
  },
  "stars": {
    "oneStarScore": 950,
    "twoStarScore": 1240,
    "threeStarScore": 1450
  },
  "obstacles": [
    {
      "id": "obs-13-a",
      "type": "blocker",
      "xPercent": 0.5,
      "yPercent": 0.54,
      "widthPercent": 0.09,
      "heightPercent": 0.036
    },
    {
      "id": "obs-13-b",
      "type": "blocker",
      "xPercent": 0.28,
      "yPercent": 0.44,
      "widthPercent": 0.08,
      "heightPercent": 0.034
    },
    {
      "id": "obs-13-c",
      "type": "blocker",
      "xPercent": 0.72,
      "yPercent": 0.44,
      "widthPercent": 0.08,
      "heightPercent": 0.034
    }
  ],
  "isPublished": true,
  "contentVersion": 1
}
```
