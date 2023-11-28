npm i
npx prisma migrate dev --name "create_table_notes" --y
npm run build
npm run start:prod