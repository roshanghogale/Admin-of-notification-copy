# 🔍 Complete Notification Review & Fixes Required

## ✅ Pages Already Correct (Send notification AFTER receiving document ID)

### 1. ✅ StudentUpdates.js
- Captures `response.data.studentUpdate?.id`
- Sends notification with documentId
- URL: Uses `https://admin.mahaalert.cloud`

### 2. ✅ CareerRoadMapPage.js  
- Captures `response.data.careerRoadmap?.id`
- Sends notification with documentId
- URL: Uses `https://admin.mahaalert.cloud`

### 3. ✅ CurrentAffairs.js
- Captures `response.data.data?.id`
- Sends notification with documentId
- URL: Uses `https://admin.mahaalert.cloud`

### 4. ✅ ResultHallTicketUpdates.js
- Captures `result.resultHallticket?.id`
- Sends notification with documentId
- URL: Uses `https://admin.mahaalert.cloud`

### 5. ✅ FreeStudyMaterialPage.js
- Captures `response.data.studyMaterial?.id`
- Sends notification with documentId
- URL: Uses `https://admin.mahaalert.cloud`

### 6. ✅ App.js (Job Updates)
- Backend handles notification
- Frontend removed duplicate notification
- ✅ FIXED

---

## ⚠️ Pages That Need Fixes

### 7. ⚠️ NewsPage.js
**Issue**: Sends notification with documentId ✅ BUT wrong URL
**Current URL**: `https://admin.mahaalert.cloud`
**Required URL**: `https://test.todaybharti.in`
**Fix**: Change notification URL

### 8. ⚠️ StoryPage.js  
**Issue**: Sends notification with documentId ✅ BUT wrong URL (has double slash)
**Current URL**: `https://admin.mahaalert.cloud//api/firebase/send-notification` (double slash)
**Required URL**: `https://test.todaybharti.in/api/firebase/send-notification`
**Fix**: Change notification URL and remove double slash

### 9. ⚠️ SliderPage.js
**Issue**: Sends notification with documentId ✅ BUT wrong URL
**Current URL**: `https://admin.mahaalert.cloud`
**Required URL**: `https://test.todaybharti.in`
**Fix**: Change notification URL

### 10. ⚠️ Notification.js
**Status**: Need to check if it sends notifications and uses correct URL

---

## 🔧 Required Changes

### Change all notification URLs from:
```javascript
await axios.post("https://admin.mahaalert.cloud/api/firebase/send-notification", firebaseData);
```

### To:
```javascript
await axios.post("https://test.todaybharti.in/api/firebase/send-notification", firebaseData);
```

---

## 📋 Files to Update

1. ✅ App.js - Already fixed (backend handles notification)
2. ❌ NewsPage.js - Change URL
3. ❌ StoryPage.js - Change URL + fix double slash
4. ❌ SliderPage.js - Change URL
5. ❓ Notification.js - Need to check
6. ❌ StudentUpdates.js - Change URL
7. ❌ CareerRoadMapPage.js - Change URL
8. ❌ CurrentAffairs.js - Change URL
9. ❌ ResultHallTicketUpdates.js - Change URL
10. ❌ FreeStudyMaterialPage.js - Change URL

---

## ✅ Verification Checklist

For each page, verify:
- [ ] Captures document ID from API response
- [ ] Only sends notification if checkbox is checked
- [ ] Only sends notification if document ID exists
- [ ] Sends notification AFTER receiving document ID
- [ ] Uses correct URL: `https://test.todaybharti.in/api/firebase/send-notification`
- [ ] Includes all required fields in notification data
- [ ] All fields are strings (for FCM compatibility)
