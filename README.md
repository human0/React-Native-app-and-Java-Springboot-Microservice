# SpecManager
Task management microservice and application

## Getting started

### project structure
specno-project-management/
├── .github/                      # GitHub-specific files
│   ├── PULL_REQUEST_TEMPLATE.md  # PR template
│   └── workflows/                # GitHub Actions CI/CD
├── api-gateway/                  # API Gateway service
├── user-service/                 # User management microservice
├── project-service/              # Project management microservice  
├── task-service/                 # Task management microservice
├── notification-service/         # Optional: Notification service
├── frontend/                     # React frontend application
├── infrastructure/               # Docker, Kubernetes configs
├── shared/                       # Shared libraries, models, utilities
├── docs/                         # Documentation
├── .gitignore                    # Git ignore file
└── README.md                     # Main documentation

### New Project

Make a local copy of the project if you do not have one already

```bash
# Clone the repository
git clone https://github.com/human0/SpecManager.git
cd SpecManager
```

## Branching Strategy

Our project follows a structured branching strategy to maintain code quality and provide a clear development history.

### Main Branches

- **main**: Production-ready code that has been thoroughly tested and is deployable to production.
- **develop**: Integration branch where features are combined and tested before release.

### Supporting Branches

- **feature/xxx**: Used for developing new features
- **fix/xxx**: Emergency fixes for production issues
- **release/x.x.x**: Preparation branch for upcoming releases

## Commit Message Guidelines

We incooperate jira traking into the Conventional Commits specification:

```
<type>(<ticket#>): <short description>

<optional body>

<optional footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semi-colons, etc.)
- **refactor**: Code changes that neither fix a bug nor add a feature
- **test**: Adding or modifying tests
- **chore**: Changes to the build process or auxiliary tools

### Example

```
feat(auth): implement JWT authentication

Add JWT token generation and validation for API requests.
Includes token refresh mechanism and secure cookie storage.

Closes #123
```

## Workflow Examples

### Starting a New Feature

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create a feature branch
git checkout -b feature/user-profile

# Work on feature with regular commits...
git add .
git commit -m "feat(SP-223): add user avatar upload component"

# Push to remote (first time)
git push -u origin feature/user-profile

# Continue development...
git commit -m "feat(SP-223): implement image cropping"
git push
```

### Creating a Pull Request

1. Push your completed feature branch to GitHub
2. Create a PR targeting the `develop` branch
3. Fill out the PR template including
4. Request reviews from team members
5. Address any feedback with new commits
6. Merge once approved

### Releasing to Production

```bash
# Create a release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/1.2.0

# Make any release-specific changes
git commit -m "chore(release): bump version to 1.2.0"

# Merge to main when ready
git checkout main
git pull origin main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Version 1.2.0"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/1.2.0
git push origin develop

# Delete release branch
git branch -d release/1.2.0
git push origin --delete release/1.2.0
```