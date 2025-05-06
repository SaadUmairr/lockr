import { PassphraseInput } from '@/components/passphrase-input';
import { UserContextProvider } from '@/context/user.context';

export default async function PassphrasePage() {
  // const session = await auth();

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <UserContextProvider>
        <PassphraseInput />
      </UserContextProvider>
    </div>
  );
}
