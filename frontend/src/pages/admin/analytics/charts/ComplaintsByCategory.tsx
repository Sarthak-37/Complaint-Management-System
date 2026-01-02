import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
interface Props {
  data: { name: string; value: number }[];
}

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100 min-w-37.5">
        {/* Full name shown in tooltip even if truncated on axis */}
        <p className="font-semibold text-gray-700 mb-1 text-sm sm:text-base wrap-break-words">{label}</p>
        <p className="text-[#3186b2] font-bold text-lg">
          {payload[0].value} <span className="text-xs text-gray-400 font-medium">Complaints</span>
        </p>
      </div>
    );
  }
  return null;
};

// Helper to shorten long labels on small screens
const formatXAxis = (tickItem: string) => {
    // You can adjust this limit based on your average label length
    const limit = 12; 
    if (typeof tickItem === 'string' && tickItem.length > limit) {
      return `${tickItem.slice(0, limit)}...`;
    }
    return tickItem;
};

const ComplaintsByCategory = ({ data }: Props) => {
  return (
    // Changed h-96 to min-h-[...px] and added h-full for better parent container adaptation
    // Added 'w-full' to ensure it spans the width of its parent
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200 h-80 sm:h-112.5 w-full flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Complaints by Category</h3>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            // Reduced margins on left/right to maximize space on mobile
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3186b2" stopOpacity={1} />
                <stop offset="100%" stopColor="#4756ca" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
              tickFormatter={formatXAxis} // Applied truncation
              dy={10}
              interval={0} // Forces all ticks to try and render (rely on truncation to fit)
            />
            
            <YAxis 
              allowDecimals={false} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: "#F3F4F6" }}
              wrapperStyle={{ outline: "none" }} // Removes accessibility outline on click
            />
            
            <Bar 
              dataKey="value" 
              fill="url(#barGradient)" 
              radius={[6, 6, 0, 0]} 
              maxBarSize={100} // Changed from fixed barSize to maxBarSize so it scales down on mobile
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplaintsByCategory;