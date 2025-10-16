import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PLineChartProps {
    currentValue: number;
    previousValue: number;
    changePercentage: number;
    prefix?: string;
    chartName: string;
}

const data = [
    { name: 'Apr23', value: 110 },
    { name: 'Apr23', value: 100 },
    { name: 'Apr23', value: 80 },
    { name: 'Apr23', value: 50 },
    { name: 'Apr23', value: 70 },
    { name: 'Apr23', value: 90 },
];

export const PLineChart = ({ 
    currentValue, 
    previousValue, 
    changePercentage,
    prefix = '',
    chartName 
}: PLineChartProps) => {
    const isPositive = changePercentage >= 0;
    const changeColor = isPositive ? '#0C5132' : '#D32F2F';
    const changeBgColor = isPositive ? '#CDFEE1' : '#FFE4E4';

    return (
        <div className="bg-white rounded-xl border border-[#EBEBEB] p-6">
            <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                    <h3 className="text-[#656565] text-base font-medium">{chartName}</h3>
                    <div 
                        className="text-xs font-medium px-2 py-1 rounded-lg"
                        style={{ 
                            backgroundColor: changeBgColor,
                            color: changeColor
                        }}
                    >
                        {changePercentage >= 0 ? '+' : ''}{changePercentage}%
                    </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                    <span className="text-[#272727] text-[30px] font-semibold">{prefix}{currentValue}</span>
                    <span className="text-[#656565] text-base font-medium">from {prefix}{previousValue}</span>
                </div>
            </div>

            <div className="mt-[30px] relative">
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#B9D7FF" stopOpacity={1} />
                                <stop offset="95%" stopColor="#E3FFF0" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 9.55, letterSpacing: '-0.02em' }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#A3AED0', fontSize: 9.55, letterSpacing: '-0.02em' }}
                            ticks={[50, 80, 100, 110]}
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#005BD3"
                            strokeWidth={2.72}
                            dot={false}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}; 