import React, { useEffect, useState } from 'react';

export default function KaliningradTime() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('ru-RU', {
        timeZone: 'Europe/Kaliningrad',
        hour: '2-digit',
        minute: '2-digit',
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="tabular-nums">{time}</span>;
}
