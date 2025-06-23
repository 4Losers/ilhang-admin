# 백엔드 API 수정 예시

## 현재 API 응답
```json
[
  {
    "cycleId": 0,
    "cycleName": "string",
    "instanceId": 0,
    "instanceStartTime": "2025-06-20T08:47:46.331Z",
    "instanceEndTime": "2025-06-20T08:47:46.331Z",
    "matchGroupCount": 0,
    "matchGroups": [
      {
        "matchGroupId": 0,
        "matchStatus": "string",
        "teamCount": 0,
        "participantCount": 0,
        "createdAt": "2025-06-20T08:47:46.331Z"
      }
    ]
  }
]
```

## 수정된 API 응답 (미션 정보 추가)
```json
[
  {
    "cycleId": 0,
    "cycleName": "string",
    "instanceId": 0,
    "instanceStartTime": "2025-06-20T08:47:46.331Z",
    "instanceEndTime": "2025-06-20T08:47:46.331Z",
    "matchGroupCount": 0,
    "matchGroups": [
      {
        "matchGroupId": 0,
        "matchStatus": "string",
        "teamCount": 0,
        "participantCount": 0,
        "createdAt": "2025-06-20T08:47:46.331Z"
      }
    ],
    "missionId": 1,
    "missionName": "일일 운동 미션",
    "missionDescription": "하루 30분 이상 운동하기"
  }
]
```

## 백엔드 DTO 수정 예시

### MatchOverviewResponse.java
```java
public class MatchOverviewResponse {
    private Long cycleId;
    private String cycleName;
    private Long instanceId;
    private LocalDateTime instanceStartTime;
    private LocalDateTime instanceEndTime;
    private Integer matchGroupCount;
    private List<MatchGroupResponse> matchGroups;
    
    // 추가할 미션 정보
    private Long missionId;
    private String missionName;
    private String missionDescription;
    
    // getters, setters...
}
```

### AdminMatchService.java
```java
@Service
@RequiredArgsConstructor
public class AdminMatchService {
    
    public List<MatchOverviewResponse> getMatchOverview() {
        // 기존 로직에서 미션 정보도 함께 조회
        return matchRepository.findMatchOverviewsWithMissions()
            .stream()
            .map(this::mapToMatchOverviewResponse)
            .collect(Collectors.toList());
    }
    
    private MatchOverviewResponse mapToMatchOverviewResponse(MatchOverviewDto dto) {
        return MatchOverviewResponse.builder()
            .cycleId(dto.getCycleId())
            .cycleName(dto.getCycleName())
            .instanceId(dto.getInstanceId())
            .instanceStartTime(dto.getInstanceStartTime())
            .instanceEndTime(dto.getInstanceEndTime())
            .matchGroupCount(dto.getMatchGroupCount())
            .matchGroups(dto.getMatchGroups())
            .missionId(dto.getMissionId())           // 추가
            .missionName(dto.getMissionName())       // 추가
            .missionDescription(dto.getMissionDescription()) // 추가
            .build();
    }
}
```

## SQL 쿼리 예시
```sql
SELECT 
    mc.cycle_id,
    mc.cycle_name,
    mi.instance_id,
    mi.start_time as instance_start_time,
    mi.end_time as instance_end_time,
    COUNT(mg.match_group_id) as match_group_count,
    m.mission_id,
    m.mission_name,
    m.description as mission_description
FROM match_cycles mc
JOIN match_instances mi ON mc.cycle_id = mi.cycle_id
LEFT JOIN match_groups mg ON mi.instance_id = mg.instance_id
LEFT JOIN missions m ON mi.mission_id = m.mission_id
GROUP BY mc.cycle_id, mi.instance_id, m.mission_id
ORDER BY mi.start_time DESC;
```

## 프론트엔드에서 기대하는 동작
1. 매치 내역 테이블에 "미션" 컬럼이 추가됨
2. 각 매치에 대한 미션 이름과 설명이 표시됨
3. 미션이 없는 경우 "미션 없음"으로 표시됨
4. 미션 설명이 길 경우 30자로 제한하고 "..." 표시 