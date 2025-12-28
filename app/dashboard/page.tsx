
import { auth } from '@/lib/auth';
import { getUserNotes, getPendingTasks, getUserRecents } from '@/app/lib/actions';
import DashboardContent from '@/components/DashboardContent';
import { DB } from '@/lib/data';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    // Fetch data in parallel
    const [notes, tasks, recents] = await Promise.all([
        getUserNotes(session.user.id),
        getPendingTasks(session.user.id),
        getUserRecents(session.user.id)
    ]);

    return (
        <DashboardContent
            initialNotes={notes}
            initialTasks={tasks}
            initialRecents={recents}
            initialPosts={DB.posts}
        />
    );
}
