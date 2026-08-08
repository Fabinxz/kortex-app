
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating Simulations...')
  // Range: 150m (2.5h) - 330m (5.5h)
  // We quote identifiers to preserve case as per Prisma defaults
  const simsCount = await prisma.$executeRawUnsafe(`
    UPDATE "simulations" 
    SET "timeInMinutes" = floor(random() * (330 - 150 + 1) + 150)::int
    WHERE "timeInMinutes" IS NULL OR "timeInMinutes" = 0;
  `)
  console.log(`Updated ${simsCount} simulations.`)
  
  console.log('Updating Essays...')
  // Range: 40m - 90m
  const essaysCount = await prisma.$executeRawUnsafe(`
    UPDATE "essays" 
    SET "timeInMinutes" = floor(random() * (90 - 40 + 1) + 40)::int
    WHERE "timeInMinutes" IS NULL OR "timeInMinutes" = 0;
  `)
  console.log(`Updated ${essaysCount} essays.`)
  
  console.log('Done!')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
