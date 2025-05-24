#!/bin/bash
echo "Cleaning up workspace..."
rm -rf .next out
rm -f app/api/posts/*.new app/api/posts/[id]/*.new
echo "Workspace cleaned"
