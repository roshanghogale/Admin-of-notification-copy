# Topic Sanitization Examples

## Sanitization Rules (Matching Android App)
1. Remove all spaces (no underscores)
2. Remove dots (.)
3. Remove parentheses ()
4. Remove ampersands (&)
5. Remove slashes (/)
6. Remove all other special characters
7. Keep only alphanumeric characters (a-z, A-Z, 0-9)
8. Limit to 900 characters (FCM requirement)

## Education Degree Examples

| Original Degree | Sanitized Topic |
|----------------|-----------------|
| Computer Science Engineering (CSE) | ComputerScienceEngineeringCSE |
| Information Technology (IT) | InformationTechnologyIT |
| Electronics & Communication (ECE) | ElectronicsCommunicationECE |
| Electrical Engineering (EE) | ElectricalEngineeringEE |
| B.Sc IT | BScIT |
| B.Sc CS | BScCS |
| BCA | BCA |
| B.E/B.Tech | BEBTech |
| Chartered Accountancy (CA) | CharteredAccountancyCA |
| Police & Defence | PoliceDefence |

## Age Group Examples

| Original | Sanitized Topic |
|----------|-----------------|
| 14 to 18 | 14to18 |
| 19 to 25 | 19to25 |
| 26 to 31 | 26to31 |
| 32 above | 32above |

## Location/Taluka Examples

| Original Taluka | Sanitized Topic |
|----------------|-----------------|
| Mumbai City | MumbaiCity |
| Pune City | PuneCity |
| Solapur North | SolapurNorth |
| Solapur South | SolapurSouth |

## Fixed Topics (No Sanitization Needed)

These topics are already in correct format:
- `all`
- `news`
- `dpaper`
- `10th`
- `12th`
- `currentaffairs`
- `governmentfree`
- `policefree`
- `bankingfree`

## Implementation

### Frontend (admin/src/utils/topicSanitizer.js)
```javascript
export const sanitizeTopic = (topic) => {
  return topic
    .replace(/\s+/g, '')
    .replace(/\./g, '')
    .replace(/[()]/g, '')
    .replace(/&/g, '')
    .replace(/\//g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 900);
};
```

### Backend Controllers
Same sanitization function is implemented inline in:
- JobUpdateController.js
- CareerRoadmapController.js
- ResultHallticketController.js

## Test Cases

### Input: "Computer Science Engineering (CSE)"
**Output:** `ComputerScienceEngineeringCSE`

### Input: "B.Sc IT"
**Output:** `BScIT`

### Input: "Electronics & Communication (ECE)"
**Output:** `ElectronicsCommunicationECE`

### Input: "19 to 25"
**Output:** `19to25`

### Input: "Police & Defence"
**Output:** `PoliceDefence`

## Why This Format?

This sanitization matches the Android app's topic subscription format defined in `DataConstants.java` and `MainActivity.java`. The Android app subscribes users to topics using this exact format, so the backend must send notifications to the same sanitized topic names for proper delivery.
