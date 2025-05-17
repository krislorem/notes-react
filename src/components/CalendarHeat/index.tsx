/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { ActivityCalendar } from 'react-activity-calendar'
import React, { useState, useEffect } from 'react'
import { getUserHeat } from '@/api/userApi'
import './index.css'
const CalendarHeatMap: React.FC<{ user_id: number }> = ({ user_id }) => {
  const [heat, setHeat] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await getUserHeat(user_id)
        const sortedData = data.heat_data
          .map((item: { date: any; count: any; level: any }) => ({
            date: item.date,
            count: Number(item.count),
            level: Number(item.level)
          }))
          .sort((a: { date: string }, b: { date: any }) => a.date.localeCompare(b.date));

        // 补充年份首尾日期
        const firstYear = sortedData[0]?.date.substring(0, 4);
        const newData = [...sortedData];

        if (firstYear) {
          const yearStart = `${firstYear}-01-01`;
          const yearEnd = `${firstYear}-12-31`;

          if (!sortedData.some((d: { date: string }) => d.date === yearStart)) {
            newData.unshift({ date: yearStart, count: 0, level: 0 });
          }
          if (!sortedData.some((d: { date: string }) => d.date === yearEnd)) {
            newData.push({ date: yearEnd, count: 0, level: 0 });
          }
        }
        if (newData.length === 0) {
          setHeat([{ date: '2025-01-01', count: 0, level: 0 }, { date: '2025-12-31', count: 0, level: 0 }]);
          setLoading(false)
          return;
        }
        setHeat(newData.sort((a, b) => a.date.localeCompare(b.date)));
        console.log('用户数据加载成功:', data);
        setLoading(false)
      } catch (error) {
        console.error('用户数据加载失败:', error);
        setLoading(false)
      }
    }
    loadData()
  }, [user_id])
  const customTheme = {
    light: ['hsl(0,0%,92%)', '#0ac740']
  }
  return (
    loading ? (
      <div className='heatmap'>加载中...</div>
    ) : (
      <div className='heatmap'>
        <ActivityCalendar
          showWeekdayLabels
          data={heat}
          theme={customTheme}
          labels={{
            totalCount: '{{year}} 年 {{count}} 次活跃'
          }}
          renderBlock={(block, activity) =>
            React.cloneElement(block, {
              'data-tooltip-id': 'react-tooltip',
              'data-tooltip-html': `${activity.count} 次活跃 ${activity.date}`,
            })
          }
        />
        <ReactTooltip id="react-tooltip" />
      </div>
    )
  )
}

export default CalendarHeatMap
