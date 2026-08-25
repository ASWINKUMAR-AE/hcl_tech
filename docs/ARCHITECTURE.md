# PathFinder AI — System Architecture

## Architecture Diagram (Activity Blueprint)

```
Learner Flow
  │
  ├── Launch Web Platform & Login (JWT Authentication)
  ├── Enter Personalization Details (Goal & Current Skills)
  │
  ├── Profiling Engine:
  │    ├── Skill Gap Engine (Mastered vs Partial vs Missing)
  │    └── Skill Graph Engine (Prerequisite DAG Topology)
  │
  ├── Vector Search & Semantic Abstraction Service
  │
  ├── Recommendation Engine (Scoring formula: 0-100)
  │    └── Hybrid scoring: Goal Match + Skill Gap + Prerequisites + History + Feedback
  │
  ├── AI Service Layer (Hosit AI API + Local Network Fallback + Deterministic Fallback)
  │
  ├── Dynamic Personalized Learning Path Generation
  │
  └── Continuously Adapts upon Resource Completion or Assessment Results
```

## Hybrid AI Design Philosophy
Deterministic software logic manages database state, authentication, prerequisite enforcement, and completion tracking.
AI model handles natural language goal extraction, contextual explanations ("Why this is recommended"), and conversational Q&A.
