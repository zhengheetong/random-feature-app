set shell := ["powershell", "-Command"]

# Default recipe to list commands
default:
    @just --list

# Run the development server
dev:
    npm run dev

# Build the project for production
build:
    npm run build

# Deploy the project to GitHub Pages
deploy:
    npm run deploy

# Run ESLint
lint:
    npm run lint

# Preview the production build locally
preview:
    npm run preview

# Stage, commit, and push changes (Usage: just push "your message")
push message:
    git add .
    git commit -m "{{message}}"
    git push
