import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const essays = await prisma.essay.findMany({ take: 5, orderBy: { date: 'desc' } })
  console.log('--- AMOSTRA DE REDAÇÕES ENEM ---')
  for (const e of essays) {
    console.log(`Título: "${e.title}"`)
    console.log(`Competências: C1=${e.c1}, C2=${e.c2}, C3=${e.c3}, C4=${e.c4}, C5=${e.c5}`)
    console.log(`Nota Total: ${e.totalScore} (Múltiplo de 20: ${e.totalScore % 20 === 0 ? 'SIM ✅' : 'NÃO ❌'})`)
    console.log('-----------------------------------')
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
