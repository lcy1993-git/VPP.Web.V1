import { createContext, useContext } from 'react';

export interface MyContextType {
  audioPlay: () => void;
  audioStop: () => void;
}

// 全局状态管理
export const MyContext = createContext({} as MyContextType);

export const MyWorkProvider = MyContext.Provider;

export const useMyContext = () => useContext(MyContext);
