# Makefile for automating various tasks
#
# This Makefile provides a set of commands to streamline daily tasks, such as managing notes, SQL files,
# and todo lists, as well as interacting with Git repositories. It includes commands for creating and
# opening files, managing Git branches, and automating repetitive tasks.
#
# Key Features:
# - File management: Create or open SQL, note files, todo lists, and scripts based on user input or date.
# - Git automation: Initialize repositories, manage branches, stash changes, and push commits.
# - Branch switching: Automate stashing and switching between predefined Git branches.
#
# Usage:
# - Run `make <target>` to execute a specific target.
# - Example: `make sql` to create or open a SQL file.

# Variables
MESSAGE ?= "default"
TODAY := $(shell date +'%d-%m-%Y')
YESTERDAY := $(shell date -v-1d +'%d-%m-%Y')
TOMORROW := $(shell date -v+1d +'%d-%m-%Y')
BRANCH := $(shell git rev-parse --abbrev-ref HEAD)

# Daily utilities
me:
	@code makefile
	@echo "================================="
	@echo "message: $(MESSAGE)"
	@echo "branch: $(BRANCH)"
	@echo "today: $(TODAY)"
	@echo "================================="

# Create or open a SQL file in the current branch folder
.PHONY: sql
sql:
	@read -p "Enter the name of the SQL file: " name; \
	snake=$$(echo $$name | sed -E 's/ /_/g' | tr '[:upper:]' '[:lower:]'); \
	mkdir -p venv/$(BRANCH)/sql; \
	if [ ! -f venv/$(BRANCH)/sql/$$snake.sql ]; then \
		touch venv/$(BRANCH)/sql/$$snake.sql; \
	fi; \
	code venv/$(BRANCH)/sql/$$snake.sql

# Open an existing SQL file using fzf, searching within the current branch folder
.PHONY: query
query:
	@if [ ! -d venv/$(BRANCH)/sql ]; then \
		mkdir -p venv/$(BRANCH)/sql; \
		echo "Created sql directory for branch $(BRANCH)"; \
	fi; \
	selected_sql=$$(find venv/$(BRANCH)/sql -type f -name "*.sql" | fzf); \
	if [ -n "$$selected_sql" ]; then \
		code "$$selected_sql"; \
	fi

# Create or open a note file in the current branch folder
.PHONY: note
note:
	@read -p "Enter the name of the NOTE file: " name; \
	snake=$$(echo $$name | sed -E 's/ /_/g' | tr '[:upper:]' '[:lower:]'); \
	mkdir -p venv/$(BRANCH)/notes; \
	if [ ! -f venv/$(BRANCH)/notes/$$snake.md ]; then \
		touch venv/$(BRANCH)/notes/$$snake.md; \
	fi; \
	code venv/$(BRANCH)/notes/$$snake.md

# Open an existing note file using fzf, searching within the current branch folder
.PHONY: notes
notes:
	@if [ ! -d venv/$(BRANCH)/notes ]; then \
		mkdir -p venv/$(BRANCH)/notes; \
		echo "Created notes directory for branch $(BRANCH)"; \
	fi; \
	selected_note=$$(find venv/$(BRANCH)/notes -type f -name "*.md" | fzf); \
	if [ -n "$$selected_note" ]; then \
		code "$$selected_note"; \
	fi

# Create or open a prompt file in the current branch folder
.PHONY: prompt
prompt:
	@read -p "Enter the name of the PROMPT file: " name; \
	snake=$$(echo $$name | sed -E 's/ /_/g' | tr '[:upper:]' '[:lower:]'); \
	mkdir -p venv/$(BRANCH)/prompts; \
	if [ ! -f venv/$(BRANCH)/prompts/$$snake.md ]; then \
		touch venv/$(BRANCH)/prompts/$$snake.md; \
	fi; \
	code venv/$(BRANCH)/prompts/$$snake.md

# Open an existing prompt file using fzf, searching within the current branch folder
.PHONY: prompts
prompts:
	@if [ ! -d venv/$(BRANCH)/prompts ]; then \
		mkdir -p venv/$(BRANCH)/prompts; \
		echo "Created prompts directory for branch $(BRANCH)"; \
	fi; \
	selected_prompt=$$(find venv/$(BRANCH)/prompts -type f -name "*.md" | fzf); \
	if [ -n "$$selected_prompt" ]; then \
		code "$$selected_prompt"; \
	fi

# Create or open today's todo list in the current branch folder
.PHONY: todo
todo:
	@mkdir -p venv/$(BRANCH)/todo; \
	if [ ! -f venv/$(BRANCH)/todo/$(TODAY).md ]; then \
		if [ -f venv/$(BRANCH)/todo/$(YESTERDAY).md ]; then \
			cp venv/$(BRANCH)/todo/$(YESTERDAY).md venv/$(BRANCH)/todo/$(TODAY).md; \
		elif [ -f venv/$(BRANCH)/todo/todo.md ]; then \
			cp venv/$(BRANCH)/todo/todo.md venv/$(BRANCH)/todo/$(TODAY).md; \
		else \
			touch venv/$(BRANCH)/todo/$(TODAY).md; \
			echo "# Todo List for $(TODAY)" > venv/$(BRANCH)/todo/$(TODAY).md; \
			echo "\n## Tasks\n\n- [ ] " >> venv/$(BRANCH)/todo/$(TODAY).md; \
		fi \
	fi; \
	code venv/$(BRANCH)/todo/$(TODAY).md

# Create or open a task file in the current branch folder
.PHONY: task
task:
	@read -p "Enter the name of the task: " name; \
	snake=$$(echo $$name | sed -E 's/ /_/g' | tr '[:upper:]' '[:lower:]'); \
	mkdir -p venv/$(BRANCH)/tasks; \
	if [ ! -f venv/$(BRANCH)/tasks/$$snake.md ]; then \
		touch venv/$(BRANCH)/tasks/$$snake.md; \
		echo "# Task: $$name" > venv/$(BRANCH)/tasks/$$snake.md; \
		echo "\n## Description\n\n" >> venv/$(BRANCH)/tasks/$$snake.md; \
		echo "\n## Steps\n\n- [ ] " >> venv/$(BRANCH)/tasks/$$snake.md; \
	fi; \
	code venv/$(BRANCH)/tasks/$$snake.md

# Open an existing task file using fzf, searching within the current branch folder
.PHONY: tasks
tasks:
	@if [ ! -d venv/$(BRANCH)/tasks ]; then \
		mkdir -p venv/$(BRANCH)/tasks; \
		echo "Created tasks directory for branch $(BRANCH)"; \
	fi; \
	selected_task=$$(find venv/$(BRANCH)/tasks -type f -name "*.md" | fzf); \
	if [ -n "$$selected_task" ]; then \
		code "$$selected_task"; \
	fi

script:
	@mkdir -p venv/$(BRANCH)/script; \
	if [ ! -f venv/$(BRANCH)/script/__init__.py ]; then \
		touch venv/$(BRANCH)/script/__init__.py; \
		echo "# Script for branch: $(BRANCH)" > venv/$(BRANCH)/script/__init__.py; \
	fi; \
	code venv/$(BRANCH)/script/__init__.py; \
	python venv/$(BRANCH)/script/__init__.py

# Git commands
see:
	@echo "================================="
	git status
	@echo "================================="
	git stash list
	@echo "================================="

save:
	git add .
	git commit -m "$(MESSAGE)"
	git push origin $(BRANCH)

commit:
	git add .
	git commit -m "$(MESSAGE)"

push:
	git push origin $(BRANCH)

stash:
	git add .
	git stash push -m $(BRANCH)

pop:
	git stash list | grep "On $(BRANCH)" | head -n 1 | awk -F: '{print $$1}' | xargs -I {} git stash pop {}

# Switch between predefined Git branches
switch-main:
	git add .
	git stash push -m $(BRANCH)
	git checkout main

