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

// Extended palette based on your original colors + complementary ones
const COLORS = ["#3186b2", "#4756ca", "#0fc9e7", "#1e293b"];

// Consistent Custom Tooltip
const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100 min-w-37.5">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: payload[0].payload.fill }}
          />
          <p className="font-semibold text-gray-700 text-sm sm:text-base">
            {payload[0].name}
          </p>
        </div>
        <p className="text-[#3186b2] font-bold text-lg">
          {payload[0].value} <span className="text-xs text-gray-400 font-medium">Users</span>
        </p>
      </div>
    );
  }
  return null;
};

const UsersByRole = ({ data }: Props) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200 h-80 sm:h-96 w-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800">Users by Role</h3>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"  // Creates the donut effect
              outerRadius="80%"  // Responsive size based on container
              paddingAngle={5}   // Separation between slices
              cornerRadius={4}   // Rounded edges
              dataKey="value"
              nameKey="name"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell 
                  key={`cell-${i}`} 
                  fill={COLORS[i % COLORS.length]} 
                  style={{ outline: 'none' }}
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
                <span className="text-gray-600 font-medium ml-1 text-xs sm:text-sm capitalize">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UsersByRole;