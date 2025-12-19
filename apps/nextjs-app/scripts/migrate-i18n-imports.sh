#!/bin/bash
# Script to migrate next-i18next imports to react-i18next

find src -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' \
  -e "s/from 'next-i18next'/from 'react-i18next'/g" \
  -e 's/from "next-i18next"/from "react-i18next"/g' \
  {} \;

echo "Migration complete! Updated all next-i18next imports to react-i18next"

