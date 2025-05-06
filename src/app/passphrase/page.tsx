import { auth } from '@/auth';
import { PassphraseInput } from '@/components/passphrase-input';
import { UserContextProvider } from '@/context/user.context';
import { redirect } from 'next/navigation';

export default async function PassphrasePage() {
  const googleID = await auth().then((session) => session?.user.googleID);
  if (!googleID) return redirect('/');
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <UserContextProvider>
        <PassphraseInput />
      </UserContextProvider>
    </div>
  );
}
