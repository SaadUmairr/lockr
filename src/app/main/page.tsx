import { auth } from '@/auth';
import { CredInput } from '@/components/input';
import { Main } from '@/components/main';
import { Navbar } from '@/components/secure/navbar';
import { DataContextProvider } from '@/context/data.context';
import { KeyContextProvider } from '@/context/key.context';
import { UserContextProvider } from '@/context/user.context';
import { redirect } from 'next/navigation';

export default async function MainPage() {
  const googleID = await auth().then((session)=>session?.user.googleID);
  if(!googleID) return redirect('/')

  return (
    <div className="p-4">
      <UserContextProvider>
        <KeyContextProvider>
          <DataContextProvider>
            <Navbar />
            <CredInput />
            <Main />
          </DataContextProvider>
        </KeyContextProvider>
      </UserContextProvider>
    </div>
  );
}
