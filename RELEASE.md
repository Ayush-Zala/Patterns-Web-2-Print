# Release Strategy & Versioning

## Semantic Versioning (SemVer)
Patterns follows `MAJOR.MINOR.PATCH` versioning:
- **MAJOR**: Breaking API changes
- **MINOR**: Backward-compatible new features
- **PATCH**: Backward-compatible bug fixes

## Release Workflow
1. Merge pull requests into `develop`.
2. Prepare release branch `release/vX.Y.Z`.
3. Push tag `vX.Y.Z` to trigger automated GitHub Release workflows.
