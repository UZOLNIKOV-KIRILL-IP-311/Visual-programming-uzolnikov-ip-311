import { useState } from 'react';

export function useOptimistic(initialData) {
  const [data, setData] = useState(initialData);

  const optimisticUpdate = async (updateFn, apiCall) => {
    const previousData = data;
    const newData = updateFn(data);
    setData(newData);
    try {
      await apiCall();
    } catch (error) {
      setData(previousData);
      console.error("Откат изменений из-за ошибки:", error);
    }
  };

  return [data, setData, optimisticUpdate];
}