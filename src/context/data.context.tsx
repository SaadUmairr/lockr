'use client';

import { GetSpaces } from '@/actions/user';
import { PasswordDataProp } from '@/components/main';
import { loadSpaces, saveSpaces } from '@/utils/idb.util';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useUser } from './user.context';

interface DataContextProp {
  space: string[];
  setSpace: Dispatch<SetStateAction<string[]>>;
  selectedSpace: string;
  setSelectedSpace: Dispatch<SetStateAction<string>>;
  pwdFields: PasswordDataProp[];
  setPwdFields: Dispatch<SetStateAction<PasswordDataProp[]>>;
  sortByCreation: boolean;
  setSortByCreation: Dispatch<SetStateAction<boolean>>;
  sortAlphabatically: boolean;
  setSortAlphabatically: Dispatch<SetStateAction<boolean>>;
}

const DataContext = createContext<DataContextProp | null>(null);

export function DataContextProvider({ children }: { children: ReactNode }) {
  const { googleID } = useUser();
  const [space, setSpace] = useState<string[]>(['main']);
  const [selectedSpace, setSelectedSpace] = useState<string>('main');

  const [sortByCreation, setSortByCreation] = useState<boolean>(false);
  const [sortAlphabatically, setSortAlphabatically] = useState<boolean>(false);

  const [pwdFields, setPwdFields] = useState<PasswordDataProp[]>([]);

  useEffect(() => {
    (async () => {
      const localSpace = await loadSpaces();
      if (localSpace && localSpace.length > 0) {
        setSpace(localSpace);
        return;
      }

      if (googleID) {
        const remoteSpace = await GetSpaces(googleID);
        if (remoteSpace && remoteSpace.length > 0) {
          setSpace(remoteSpace);

          await saveSpaces(remoteSpace);
          return;
        }
      }

      setSpace(['main']);
    })();
  }, [googleID]);

  return (
    <DataContext.Provider
      value={{
        space,
        selectedSpace,
        setSpace,
        setSelectedSpace,
        pwdFields,
        setPwdFields,
        sortByCreation,
        setSortByCreation,
        sortAlphabatically,
        setSortAlphabatically,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = (): DataContextProp => {
  const context = useContext(DataContext);
  if (!context)
    throw new Error('useData must be used within a DataContextProvider');
  return context;
};
