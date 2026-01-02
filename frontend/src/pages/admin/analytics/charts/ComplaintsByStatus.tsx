import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

interface Props {
  data: { name: string; value: number }[];
}

// Consistent color palette
const COLORS = ["#3186b2", "#0fc9e7", "#4756ca", "#f97316", "#10b981", "#ef4444"];

// Custom Tooltip (Consistent with BarChart)
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100 min-w-37.5">
        <div className="flex items-center gap-2 mb-1">
          {/* dynamic color dot based on the slice */}
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <p className="font-semibold text-gray-700 text-sm sm:text-base">
            {payload[0].name}
          </p>
        </div>
        <p className="text-[#3186b2] font-bold text-lg">
          {payload[0].value} <span className="text-xs text-gray-400 font-medium">Complaints</span>
        </p>
      </div>
    );
  }
  return null;
};

const ComplaintsByStatus = ({ data }: Props) => {
  return (
    // Flex layout handles the height distribution better than block
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200 h-80 sm:h-96 w-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Complaints by Status</h3>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              // Using percentages ensures responsiveness on mobile vs desktop
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5} // Adds white space between slices
              cornerRadius={4} // Rounds the edges of the slices
              dataKey="value"
              nameKey="name"
              stroke="none" // Removes the default ugly outline
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  style={{ outline: 'none' }} // Accessibility fix: removes blue focus ring
                />
              ))}
            </Pie>
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span className="text-gray-600 font-medium ml-1 text-xs sm:text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComplaintsByStatus;