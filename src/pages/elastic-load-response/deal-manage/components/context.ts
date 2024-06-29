import { createContext, useContext } from 'react';


// 全局状态管理
export const MyContext = createContext({} as any);

export const MyProvider = MyContext.Provider;

export const useMyContext = () => useContext(MyContext);
