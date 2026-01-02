
import { db } from '../server/db';
import { documents } from '../shared/schema';
import { like, desc } from 'drizzle-orm';

async function main() {
    console.log('Searching for docs with ID part 1767367338935...');
    const resultsUrl = await db.select().from(documents).where(like(documents.url, '%1767367338935%'));
    console.log('Search by partial URL:', resultsUrl);

    console.log('--- Last 5 Documents ---');
    const recent = await db.select().from(documents).orderBy(desc(documents.createdAt)).limit(5);
    recent.forEach(d => {
        console.log(`ID: ${d.id}, Title: ${d.title}, URL: ${d.url}, Type: ${d.type}`);
    });

    process.exit(0);
}

main().catch(console.error);
