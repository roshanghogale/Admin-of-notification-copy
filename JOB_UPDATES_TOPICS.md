# 📢 Job Updates - FCM Topics Documentation

## Overview
Job Updates (App.js) sends notifications via **backend controller** (JobUpdateController.js).

---

## Current Implementation

### Topic Used
**Single Topic: `"all"`**

The Job Updates notification is currently sent to **ALL users** regardless of:
- Job Type (banking/private/government)
- Sub Type (Private/Government/Maha/Central/Internship/Regular)
- Education Categories
- Bachelor Degrees
- Masters Degrees
- Age Requirement
- Job Place

### Code Reference
```javascript
// JobUpdateController.js - Line ~120
await NotificationService.sendNotificationToTopic(
  'all',  // ← Always sends to "all" topic
  null,
  null,
  null,
  null,
  notificationData
);
```

---

## Possible Topics (If Topic-Based Routing Was Implemented)

### 1. Based on Job Type
```javascript
// type field values
topics = ["banking", "private", "government"]
```

**Example:**
- Banking jobs → topic: `"banking"`
- Private jobs → topic: `"private"`
- Government jobs → topic: `"government"`

---

### 2. Based on Sub Type
```javascript
// subType field values
topics = {
  banking: ["Private", "Government"],
  private: ["Internship", "Regular"],
  government: ["Maha", "Central"]
}
```

**Example:**
- Government + Maha → topic: `"Maha"`
- Private + Internship → topic: `"Internship"`
- Banking + Government → topic: `"Government"`

---

### 3. Based on Education Categories
```javascript
// educationCategories field values
topics = [
  "All", "10th", "12th", "Edu (B.ed and D.ed)", "Arts", "Commerce", 
  "Engineering (Degree)", "Diploma (Polytechnic)", "Medical", "Dental", 
  "ITI", "Pharmacy", "Agriculture", "Computer Science/IT", "Nursing", 
  "Law", "Veterinary", "Journalism", "Management", "Hotel Management",
  "Animation & Multimedia", "Other B.Sc", "Other"
]
```

**Example:**
- Education: ["Engineering (Degree)"] → topic: `"Engineering (Degree)"`
- Education: ["10th"] → topic: `"10th"`
- Education: ["All"] → topic: `"all"`

---

### 4. Based on Bachelor Degrees
```javascript
// bachelorDegrees field values (200+ options)
topics = [
  // Engineering
  "Computer Science Engineering (CSE)", "Information Technology (IT)", 
  "Mechanical Engineering (ME)", "Civil Engineering (CE)", 
  "Electrical Engineering (EE)", "Electronics & Communication (ECE)",
  
  // Commerce
  "B.Com", "B.Com (Hons)", "Chartered Accountancy (CA)",
  
  // Arts
  "BA", "BA (Hons)", "BA LLB",
  
  // Medical
  "MBBS", "BAMS", "BHMS", "BDS",
  
  // ITI
  "Electrician", "Fitter", "Welder (Gas & Electric)", "Computer Operator (COPA)",
  
  // Computer Science/IT
  "BCA", "B.Sc IT", "B.Sc CS",
  
  // Management
  "BBA", "BMS", "Aviation",
  
  // Law
  "LLB", "BA LLB", "BBA LLB",
  
  // And 150+ more degree options...
]
```

**Example:**
- Bachelor: ["Computer Science Engineering (CSE)"] → topic: `"Computer Science Engineering (CSE)"`
- Bachelor: ["BCA", "B.Sc IT"] → topics: `["BCA", "B.Sc IT"]` (multiple)

---

### 5. Based on Masters Degrees
```javascript
// mastersDegrees field values
topics = [
  "M.Tech", "M.E", "MBA", "M.Com", "MA", "MCA", "M.Sc IT", 
  "LLM", "M.Pharm", "MD", "MS", "MDS", "M.Sc Nursing",
  "M.Ed", "MVSc", "PGDM", "MHM", "None"
]
```

**Example:**
- Masters: ["M.Tech", "MBA"] → topics: `["M.Tech", "MBA"]` (multiple)

---

### 6. Based on Age Groups
```javascript
// ageRequirement field (free text, but could be standardized)
standardized_topics = [
  "14 to 18", "19 to 25", "26 to 31", "32 and above"
]
```

**Example:**
- Age: "18-25 years" → topic: `"19 to 25"`
- Age: "21-30" → topic: `"19 to 25"` or `"26 to 31"`

---

### 7. Based on Job Place (Location)
```javascript
// jobPlace field (free text, could be standardized to districts/states)
possible_topics = [
  "Maharashtra", "Pune", "Mumbai", "Nagpur", "All India",
  // Or use district names from other pages:
  "Ahmednagar", "Akola", "Amravati", "Aurangabad", etc.
]
```

**Example:**
- Job Place: "Maharashtra" → topic: `"Maharashtra"`
- Job Place: "Pune" → topic: `"Pune"`

---

## Current vs Potential Implementation

### Current (As-Is)
```javascript
// Always sends to everyone
topic: "all"
```

### Potential (Topic-Based Routing)
```javascript
// Example 1: Engineering job
topics: ["Engineering (Degree)", "Computer Science Engineering (CSE)", "M.Tech"]

// Example 2: Banking job
topics: ["banking", "Government", "B.Com", "MBA"]

// Example 3: Government job for 12th pass
topics: ["government", "Maha", "12th"]

// Example 4: All education levels
topics: ["all"]
```

---

## Summary

| Field | Current Topic | Possible Topics Count |
|-------|--------------|----------------------|
| **Job Type** | `"all"` | 3 (banking, private, government) |
| **Sub Type** | `"all"` | 6 (Private, Government, Maha, Central, Internship, Regular) |
| **Education Categories** | `"all"` | 23 categories |
| **Bachelor Degrees** | `"all"` | 200+ degrees |
| **Masters Degrees** | `"all"` | 20+ degrees |
| **Age Groups** | `"all"` | 4 standardized groups |
| **Job Place** | `"all"` | Unlimited (free text) |

**Current Implementation:** 1 topic (`"all"`)  
**Potential Implementation:** 250+ possible topics based on user preferences
